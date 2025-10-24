# 🔢 Prisma - Aggregations and GroupBy

> Las agregaciones en Prisma permiten realizar operaciones matemáticas y estadísticas sobre conjuntos de datos sin tener que cargar todos los registros en memoria. Prisma convierte estas operaciones en consultas SQL optimizadas (como COUNT, SUM, AVG) que se ejecutan directamente en la base de datos, devolviendo solo el resultado calculado. Esto es especialmente útil para análisis de datos, dashboards y reportes donde necesitás estadísticas sin procesar miles de registros individualmente.

---

## 📊 Schema de ejemplo

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  age       Int?
  country   String
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  views     Int      @default(0)
  likes     Int      @default(0)
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## 1️⃣ `_count` - Contar relaciones

### Contar posts de cada usuario

```js
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        posts: true
      }
    }
  }
})
```

**Resultado:**
```js
[
  {
    id: 1,
    name: 'Ana',
    email: 'ana@example.com',
    _count: {
      posts: 5  // ← Cantidad sin traer los posts
    }
  }
]
```

### Contar con filtros

```js
const users = await prisma.user.findMany({
  select: {
    name: true,
    _count: {
      select: {
        posts: {
          where: {
            published: true
          }
        }
      }
    }
  }
})
```

**Resultado:**
```js
[
  {
    name: 'Ana',
    _count: {
      posts: 3  // Solo posts publicados
    }
  }
]
```

---

## 2️⃣ `aggregate()` - Agregaciones sobre toda la tabla

### Operaciones disponibles

- `_count` - Contar registros
- `_sum` - Sumar valores
- `_avg` - Promedio
- `_min` - Valor mínimo
- `_max` - Valor máximo

### Ejemplo completo

```js
const stats = await prisma.post.aggregate({
  _count: {
    id: true
  },
  _sum: {
    views: true,
    likes: true
  },
  _avg: {
    views: true
  },
  _min: {
    views: true
  },
  _max: {
    views: true
  }
})
```

**Resultado:**
```js
{
  _count: { id: 100 },        // Total de posts
  _sum: { 
    views: 15000,              // Suma de todas las vistas
    likes: 3000 
  },
  _avg: { views: 150 },        // Promedio de vistas
  _min: { views: 10 },         // Post con menos vistas
  _max: { views: 500 }         // Post con más vistas
}
```

### Con filtros y ordenamiento

```js
const stats = await prisma.post.aggregate({
  _avg: {
    views: true
  },
  where: {
    published: true,
    createdAt: {
      gte: new Date('2024-01-01')
    }
  }
})
```

---

## 3️⃣ `groupBy()` - Agrupar y agregar

### Agrupar por un campo

```js
const result = await prisma.post.groupBy({
  by: ['userId'],
  _count: {
    id: true
  },
  _sum: {
    views: true
  },
  _avg: {
    views: true
  }
})
```

**Resultado:**
```js
[
  {
    userId: 1,
    _count: { id: 5 },
    _sum: { views: 750 },
    _avg: { views: 150 }
  },
  {
    userId: 2,
    _count: { id: 3 },
    _sum: { views: 450 },
    _avg: { views: 150 }
  }
]
```

### Agrupar por múltiples campos

```js
const result = await prisma.user.groupBy({
  by: ['country', 'age'],
  _count: {
    id: true
  }
})
```

**Resultado:**
```js
[
  {
    country: 'Argentina',
    age: 25,
    _count: { id: 10 }
  },
  {
    country: 'Argentina',
    age: 30,
    _count: { id: 5 }
  }
]
```

---

## 4️⃣ Filtros con `where` y `having`

### `where` - Filtrar ANTES de agrupar

```js
const result = await prisma.post.groupBy({
  by: ['userId'],
  _sum: {
    views: true
  },
  where: {
    published: true,  // ← Filtra posts antes de agrupar
    views: {
      gt: 50
    }
  }
})
```

### `having` - Filtrar DESPUÉS de agrupar

```js
const result = await prisma.post.groupBy({
  by: ['userId'],
  _sum: {
    views: true
  },
  _avg: {
    views: true
  },
  having: {
    views: {
      _avg: {
        gt: 100  // ← Solo grupos con promedio > 100
      }
    }
  }
})
```

**Resultado:** Solo usuarios cuyo promedio de vistas sea mayor a 100.

### Combinar `where` y `having`

```js
const result = await prisma.post.groupBy({
  by: ['userId'],
  _count: {
    id: true
  },
  where: {
    published: true  // Filtra ANTES de agrupar
  },
  having: {
    id: {
      _count: {
        gte: 5  // Solo usuarios con 5+ posts publicados
      }
    }
  }
})
```

---

## 5️⃣ Ordenar resultados

### Ordenar por campo agrupado

```js
const result = await prisma.user.groupBy({
  by: ['country'],
  _count: {
    id: true
  },
  orderBy: {
    country: 'asc'
  }
})
```

### Ordenar por agregación

```js
const result = await prisma.post.groupBy({
  by: ['userId'],
  _sum: {
    views: true
  },
  orderBy: {
    _sum: {
      views: 'desc'  // Ordenar por suma de vistas descendente
    }
  }
})
```

### Ordenar por conteo

```js
const result = await prisma.post.groupBy({
  by: ['userId'],
  _count: {
    id: true
  },
  orderBy: {
    _count: {
      id: 'desc'  // Usuario con más posts primero
    }
  }
})
```

---

## 6️⃣ Paginación con `skip` y `take`

```js
const page = 2
const limit = 10

const result = await prisma.post.groupBy({
  by: ['userId'],
  _count: {
    id: true
  },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: {
    _count: {
      id: 'desc'
    }
  }
})
```

---

## 7️⃣ Casos de uso prácticos

### Dashboard: Estadísticas de posts

```js
const postStats = await prisma.post.aggregate({
  _count: { id: true },
  _sum: { views: true, likes: true },
  _avg: { views: true },
  where: {
    published: true
  }
})

console.log(`Total posts: ${postStats._count.id}`)
console.log(`Total vistas: ${postStats._sum.views}`)
console.log(`Promedio: ${postStats._avg.views}`)
```

### Top 5 usuarios más activos

```js
const topUsers = await prisma.post.groupBy({
  by: ['userId'],
  _count: {
    id: true
  },
  orderBy: {
    _count: {
      id: 'desc'
    }
  },
  take: 5
})

// Obtener info de usuarios
const userIds = topUsers.map(u => u.userId)
const users = await prisma.user.findMany({
  where: {
    id: { in: userIds }
  }
})
```

### Posts por mes

```js
// Nota: groupBy no soporta funciones SQL directamente
// Para agrupar por mes, necesitas SQL raw o hacerlo en código

const posts = await prisma.post.findMany({
  select: {
    createdAt: true,
    views: true
  }
})

// Agrupar por mes en JavaScript
const byMonth = posts.reduce((acc, post) => {
  const month = post.createdAt.toISOString().slice(0, 7) // '2024-01'
  if (!acc[month]) {
    acc[month] = { count: 0, totalViews: 0 }
  }
  acc[month].count++
  acc[month].totalViews += post.views
  return acc
}, {})
```

### Usuarios por país con promedio de edad

```js
const usersByCountry = await prisma.user.groupBy({
  by: ['country'],
  _count: {
    id: true
  },
  _avg: {
    age: true
  },
  where: {
    age: {
      not: null
    }
  },
  orderBy: {
    _count: {
      id: 'desc'
    }
  }
})
```

---

## 8️⃣ Limitaciones y alternativas

### ❌ `groupBy` no soporta `include` o `select` anidado

```js
// ❌ NO funciona
const result = await prisma.post.groupBy({
  by: ['userId'],
  include: {
    user: true  // ERROR
  }
})
```

### ✅ Solución: Hacer dos queries

```js
// 1. GroupBy
const grouped = await prisma.post.groupBy({
  by: ['userId'],
  _count: { id: true }
})

// 2. Obtener usuarios
const userIds = grouped.map(g => g.userId)
const users = await prisma.user.findMany({
  where: { id: { in: userIds } }
})

// 3. Combinar en código
const result = grouped.map(g => ({
  ...g,
  user: users.find(u => u.id === g.userId)
}))
```

### ❌ Funciones de fecha no soportadas directamente

```js
// ❌ NO funciona - no puede agrupar por YEAR(createdAt)
const result = await prisma.post.groupBy({
  by: ['YEAR(createdAt)']  // ERROR
})
```

### ✅ Alternativa: Raw SQL

```js
const result = await prisma.$queryRaw`
  SELECT 
    DATE_TRUNC('month', "createdAt") as month,
    COUNT(*) as count,
    SUM(views) as total_views
  FROM "Post"
  GROUP BY DATE_TRUNC('month', "createdAt")
  ORDER BY month DESC
`
```

---

## 💡 Diferencias clave

| Método | Cuándo usar | Devuelve |
|--------|-------------|----------|
| `_count` en `include` | Contar relaciones sin cargarlas | Objeto con el modelo + count |
| `aggregate()` | Estadísticas de toda la tabla | Objeto con agregaciones |
| `groupBy()` | Estadísticas por grupos | Array de grupos con agregaciones |

### `count()` vs `_count`

```js
// count() - Cuenta registros de la tabla principal
const total = await prisma.user.count()
// → 100

// _count - Cuenta relaciones
const users = await prisma.user.findMany({
  include: {
    _count: { select: { posts: true } }
  }
})
// → [{ id: 1, name: 'Ana', _count: { posts: 5 } }]
```

---

## 🚀 Mejores prácticas

- ✅ Usa `_count` para mostrar cantidades sin cargar datos
- ✅ Usa `aggregate()` para estadísticas globales
- ✅ Usa `groupBy()` para análisis por categorías
- ✅ Filtra con `where` antes de agrupar (más eficiente)
- ✅ Usa `having` solo para filtrar por agregaciones
- ✅ Combina queries cuando `groupBy` no soporte includes
- ✅ Para agregaciones complejas, considera SQL raw
- ✅ Ordena por agregaciones para rankings
- ✅ Implementa paginación en resultados grandes