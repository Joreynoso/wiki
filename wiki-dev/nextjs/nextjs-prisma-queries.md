# 🔍 Prisma - Métodos de consulta y selección

> Prisma Client proporciona métodos poderosos para seleccionar campos específicos, incluir relaciones y filtrar datos. Por defecto, las consultas retornan todos los campos escalares del modelo pero ninguna relación. Usar `select` e `include` de forma estratégica reduce el tamaño de las respuestas y mejora la velocidad de las consultas, ya que solo traés de la base de datos lo que realmente necesitás. Prisma también soporta `omit` (desde v5.13.0) para excluir campos específicos, funcionando como el opuesto a `select`.

---

## 📊 Schema de ejemplo

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  role      String   @default("USER")
  profile   Profile?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  userId Int     @unique
  user   User    @relation(fields: [userId], references: [id])
}

model Post {
  id         Int        @id @default(autoincrement())
  title      String
  content    String?
  published  Boolean    @default(false)
  authorId   Int
  author     User       @relation(fields: [authorId], references: [id])
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

---

## 1️⃣ Consulta por defecto (sin select ni include)

### Retorna todos los campos escalares, sin relaciones

```js
const users = await prisma.user.findMany()
```

**Resultado:**
```js
[
  {
    id: 1,
    email: 'ana@example.com',
    name: 'Ana',
    password: 'hash123',
    role: 'USER',
    createdAt: '2024-01-01T00:00:00.000Z'
    // ❌ NO incluye profile ni posts
  }
]
```

---

## 2️⃣ select - Seleccionar campos específicos

### Seleccionar solo algunos campos

```js
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true
    // ❌ NO incluye password, role, createdAt
  }
})
```

**Resultado:**
```js
[
  {
    id: 1,
    email: 'ana@example.com',
    name: 'Ana'
  }
]
```

### Select con relaciones

```js
const users = await prisma.user.findMany({
  select: {
    name: true,
    email: true,
    posts: {
      select: {
        title: true,
        published: true
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
    email: 'ana@example.com',
    posts: [
      { title: 'Post 1', published: true },
      { title: 'Post 2', published: false }
    ]
  }
]
```

---

## 3️⃣ include - Incluir relaciones completas

### Include básico

```js
const users = await prisma.user.findMany({
  include: {
    profile: true,
    posts: true
  }
})
```

**Resultado:**
```js
[
  {
    id: 1,
    email: 'ana@example.com',
    name: 'Ana',
    password: 'hash123',
    role: 'USER',
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      id: 1,
      bio: 'Desarrolladora',
      userId: 1
    },
    posts: [
      { id: 1, title: 'Post 1', content: '...', published: true, authorId: 1 }
    ]
  }
]
```

**✅ Include retorna TODOS los campos del modelo + las relaciones especificadas**

### Include con select anidado

```js
const users = await prisma.user.findMany({
  include: {
    posts: {
      select: {
        title: true,
        published: true
      }
    }
  }
})
```

**Resultado:**
```js
[
  {
    // ✅ Todos los campos del usuario
    id: 1,
    email: 'ana@example.com',
    name: 'Ana',
    password: 'hash123',
    role: 'USER',
    createdAt: '2024-01-01T00:00:00.000Z',
    posts: [
      // ❌ Solo title y published de posts
      { title: 'Post 1', published: true }
    ]
  }
]
```

---

## 4️⃣ omit - Excluir campos específicos

### Omit básico (Prisma 5.13.0+)

```js
const users = await prisma.user.findMany({
  omit: {
    password: true
  }
})
```

**Resultado:**
```js
[
  {
    id: 1,
    email: 'ana@example.com',
    name: 'Ana',
    // ❌ password excluido
    role: 'USER',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]
```

### Omit en relaciones anidadas

```js
const users = await prisma.user.findMany({
  omit: {
    password: true
  },
  include: {
    posts: {
      omit: {
        content: true
      }
    }
  }
})
```

---

## 5️⃣ where - Filtrar resultados

### Filtros simples

```js
// Email que termina en ejemplo.com
const users = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'ejemplo.com'
    }
  }
})

// Posts publicados
const posts = await prisma.post.findMany({
  where: {
    published: true
  }
})

// Nombre contiene "Ana" (case-insensitive)
const users = await prisma.user.findMany({
  where: {
    name: {
      contains: 'Ana',
      mode: 'insensitive'
    }
  }
})
```

### Operadores lógicos (AND, OR, NOT)

```js
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { endsWith: 'gmail.com' } },
      { email: { endsWith: 'hotmail.com' } }
    ],
    NOT: {
      role: 'ADMIN'
    }
  }
})
```

### Filtrar por relaciones

```js
// Usuarios con al menos un post sin publicar
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: false
      }
    }
  }
})

// Posts cuyo autor tiene email de ejemplo.com
const posts = await prisma.post.findMany({
  where: {
    author: {
      email: {
        endsWith: 'ejemplo.com'
      }
    }
  }
})
```

---

## 6️⃣ orderBy - Ordenar resultados

### Orden simple

```js
const users = await prisma.user.findMany({
  orderBy: {
    name: 'asc'  // o 'desc'
  }
})
```

### Orden múltiple

```js
const users = await prisma.user.findMany({
  orderBy: [
    { role: 'desc' },
    { name: 'asc' }
  ]
})
```

### Ordenar por relaciones

```js
// Posts ordenados por nombre del autor
const posts = await prisma.post.findMany({
  orderBy: {
    author: {
      name: 'asc'
    }
  }
})

// Usuarios ordenados por cantidad de posts
const users = await prisma.user.findMany({
  orderBy: {
    posts: {
      _count: 'desc'
    }
  }
})
```

---

## 7️⃣ skip y take - Paginación

```js
const page = 2
const pageSize = 10

const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,  // Saltar 10 registros
  take: pageSize                 // Tomar 10 registros
})
```

### Paginación completa

```js
const page = 1
const limit = 10

const [users, total] = await Promise.all([
  prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  }),
  prisma.user.count()
])

const response = {
  data: users,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
}
```

---

## 8️⃣ Contar relaciones (_count)

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
      posts: 5
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

---

## 9️⃣ distinct - Valores únicos

```js
// Roles únicos
const distinctRoles = await prisma.user.findMany({
  distinct: ['role'],
  select: {
    role: true
  }
})
```

**Resultado:**
```js
[
  { role: 'USER' },
  { role: 'ADMIN' }
]
```

---

## 🔟 Métodos de búsqueda

### findMany - Múltiples registros

```js
const users = await prisma.user.findMany({
  where: { role: 'ADMIN' }
})
```

### findUnique - Por clave única

```js
const user = await prisma.user.findUnique({
  where: { email: 'ana@example.com' }
})
```

### findFirst - Primer resultado

```js
const user = await prisma.user.findFirst({
  where: { role: 'ADMIN' },
  orderBy: { createdAt: 'desc' }
})
```

### findUniqueOrThrow - Error si no existe

```js
try {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: 'noexiste@example.com' }
  })
} catch (error) {
  console.log('Usuario no encontrado')
}
```

---

## 💡 Diferencias clave: select vs include

| Aspecto | select | include |
|---------|--------|---------|
| **Campos del modelo** | Solo los especificados | TODOS los campos |
| **Relaciones** | Puede incluirlas | Puede incluirlas |
| **Uso típico** | Cuando querés pocos campos | Cuando querés todos los campos + relaciones |
| **Se pueden combinar** | ❌ No | ✅ Sí (con select anidado) |

### Ejemplo comparativo

```js
// select - Solo name y posts.title
const result1 = await prisma.user.findMany({
  select: {
    name: true,
    posts: {
      select: {
        title: true
      }
    }
  }
})
// Resultado: { name: "Ana", posts: [{ title: "Post 1" }] }

// include - Todos los campos del usuario + posts completos
const result2 = await prisma.user.findMany({
  include: {
    posts: true
  }
})
// Resultado: { id: 1, email: "...", name: "Ana", ..., posts: [{ id: 1, title: "Post 1", content: "...", ... }] }

// include + select anidado - Todos los campos del usuario + solo posts.title
const result3 = await prisma.user.findMany({
  include: {
    posts: {
      select: {
        title: true
      }
    }
  }
})
// Resultado: { id: 1, email: "...", name: "Ana", ..., posts: [{ title: "Post 1" }] }
```

---

## 🚀 Mejores prácticas

- ✅ Usa `select` cuando necesites pocos campos específicos
- ✅ Usa `include` cuando necesites todos los campos + relaciones
- ✅ Usa `omit` para excluir campos sensibles (como passwords)
- ✅ Siempre implementa paginación con `skip` y `take` para queries grandes
- ✅ Usa `_count` para obtener cantidades sin traer todos los datos
- ✅ Combina `where` con `include/select` para filtrar relaciones
- ✅ Usa `distinct` para evitar duplicados
- ✅ Prefiere `findUnique` sobre `findFirst` cuando tengas un identificador único