# 🗄️ Next.js + Prisma ORM - API completa con relaciones

> Prisma ORM es un toolkit de base de datos type-safe de próxima generación para Node.js y TypeScript. Simplifica el acceso y gestión de bases de datos mediante un schema declarativo y un cliente auto-generado completamente tipado. En Next.js App Router, Prisma funciona perfectamente con Server Components, Server Actions y Route Handlers, eliminando la necesidad de escribir SQL manualmente y proporcionando autocompletado inteligente en todo tu código.

---

## 📦 Instalación y configuración inicial

### 1. Instalar dependencias

```bash
npm install prisma --save-dev
npm install @prisma/client
npm install tsx --save-dev
```

### 2. Inicializar Prisma

```bash
npx prisma init
```

Esto crea:

- Carpeta `prisma/` con archivo `schema.prisma`
- Archivo `.env` con `DATABASE_URL`

### 3. Configurar la conexión a la base de datos

Edita el archivo `.env`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/midb"
```

Para PostgreSQL, MySQL, SQLite, etc.

---

## 🔧 Configurar el cliente de Prisma

### Crear el cliente singleton

Crea el archivo `src/lib/prisma.js`:

```js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
```

**¿Por qué?** Evita crear múltiples instancias de Prisma Client en desarrollo (hot-reload de Next.js).

---

## 📋 Definir el schema con relaciones

Edita `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 1️⃣ Relación 1:1 - User y Profile
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  profile   Profile? // Relación 1:1
  posts     Post[]   // Relación 1:muchos
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  userId Int     @unique
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// 2️⃣ Relación 1:muchos - User y Post
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  content    String?
  published  Boolean    @default(false)
  authorId   Int
  author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  categories Category[] // Relación M:M
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}

// 3️⃣ Relación M:M - Post y Category
model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

### Explicación de relaciones

- **1:1 (User ↔ Profile)**: Un usuario tiene un perfil, un perfil pertenece a un usuario
- **1:Muchos (User ↔ Post)**: Un usuario tiene muchos posts, un post pertenece a un usuario
- **M:M (Post ↔ Category)**: Un post puede tener muchas categorías, una categoría puede estar en muchos posts

---

## 🚀 Migrar el schema a la base de datos

```bash
npx prisma migrate dev --name init
```

Esto:

- Crea las tablas en la DB
- Genera el Prisma Client con tipos TypeScript

---

## 🌱 Crear datos de prueba (Seed)

Crea `prisma/seed.js`:

```js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpiar datos existentes
  await prisma.category.deleteMany()
  await prisma.post.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  // Crear usuario con perfil (1:1)
  const user1 = await prisma.user.create({
    data: {
      email: 'ana@example.com',
      name: 'Ana García',
      profile: {
        create: {
          bio: 'Desarrolladora full-stack'
        }
      }
    }
  })

  // Crear otro usuario
  const user2 = await prisma.user.create({
    data: {
      email: 'juan@example.com',
      name: 'Juan Pérez'
    }
  })

  // Crear categorías
  const category1 = await prisma.category.create({
    data: { name: 'Tecnología' }
  })

  const category2 = await prisma.category.create({
    data: { name: 'Programación' }
  })

  // Crear posts con categorías (1:muchos y M:M)
  await prisma.post.create({
    data: {
      title: 'Introducción a Next.js',
      content: 'Next.js es un framework de React...',
      published: true,
      authorId: user1.id,
      categories: {
        connect: [{ id: category1.id }, { id: category2.id }]
      }
    }
  })

  await prisma.post.create({
    data: {
      title: 'Prisma ORM',
      content: 'Prisma es un ORM moderno...',
      published: true,
      authorId: user1.id,
      categories: {
        connect: [{ id: category2.id }]
      }
    }
  })

  console.log('✅ Seed completado')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Actualiza `package.json`:

```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

Ejecutar seed:

```bash
npx prisma db seed
```

---

## 🛠️ Crear API Routes

### GET - Listar usuarios con relaciones

```js
// app/api/users/route.js
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        posts: {
          include: {
            categories: true
          }
        }
      }
    })

    return Response.json(users)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### POST - Crear usuario con perfil (1:1)

```js
// app/api/users/route.js
export async function POST(request) {
  try {
    const { email, name, bio } = await request.json()

    const user = await prisma.user.create({
      data: {
        email,
        name,
        profile: {
          create: {
            bio
          }
        }
      },
      include: {
        profile: true
      }
    })

    return Response.json(user, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### GET - Usuario por ID

```js
// app/api/users/[id]/route.js
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        profile: true,
        posts: {
          include: {
            categories: true
          }
        }
      }
    })

    if (!user) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### POST - Crear post con categorías (M:M)

```js
// app/api/posts/route.js
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { title, content, authorId, categoryIds } = await request.json()

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        categories: {
          connect: categoryIds.map(id => ({ id }))
        }
      },
      include: {
        author: true,
        categories: true
      }
    })

    return Response.json(post, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### GET - Posts con filtros y paginación

```js
// app/api/posts/route.js
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const published = searchParams.get('published')

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(published !== null && { published: published === 'true' })
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          categories: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count({ where })
    ])

    return Response.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### PUT - Actualizar post

```js
// app/api/posts/[id]/route.js
import prisma from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const { title, content, published, categoryIds } = await request.json()

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        published,
        ...(categoryIds && {
          categories: {
            set: categoryIds.map(id => ({ id }))
          }
        })
      },
      include: {
        author: true,
        categories: true
      }
    })

    return Response.json(post)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### DELETE - Eliminar post

```js
// app/api/posts/[id]/route.js
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await prisma.post.delete({
      where: { id: parseInt(id) }
    })

    return Response.json({ message: 'Post eliminado' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 🎯 Comandos útiles de Prisma

```bash
# Generar Prisma Client
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Abrir Prisma Studio (UI para ver datos)
npx prisma studio

# Resetear base de datos
npx prisma migrate reset

# Validar schema
npx prisma validate

# Formatear schema
npx prisma format

# Traer schema desde DB existente
npx prisma db pull

# Empujar schema a DB sin crear migración
npx prisma db push
```

---

## 💡 Ejemplos de queries avanzadas

### Filtros complejos

```js
const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: 'Next.js' } },
      { content: { contains: 'React' } }
    ],
    AND: [
      { published: true },
      { author: { email: { endsWith: '@example.com' } } }
    ]
  }
})
```

### Agregaciones

```js
const stats = await prisma.post.groupBy({
  by: ['authorId'],
  _count: {
    id: true
  },
  _avg: {
    id: true
  }
})
```

### Transacciones

```js
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'test@example.com', name: 'Test' } }),
  prisma.post.create({ data: { title: 'Post', authorId: 1 } })
])
```

---

## 🚀 Mejores prácticas

- ✅ Usa el cliente singleton para evitar múltiples conexiones
- ✅ Incluye solo los datos que necesitas con `select` o `include`
- ✅ Usa `onDelete: Cascade` para eliminar datos relacionados automáticamente
- ✅ Implementa paginación en queries grandes
- ✅ Usa transacciones para operaciones múltiples que deben ser atómicas
- ✅ Agrega índices en campos que uses frecuentemente en `where`
- ✅ Usa `prisma studio` para visualizar datos durante desarrollo
- ✅ Marca funciones de data access con `'use server'` en Server Actions
