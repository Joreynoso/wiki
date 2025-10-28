# 📝 Next.js - Form Handling (Client & Server)

> Next.js ofrece múltiples formas de manejar formularios: desde Server Components con Server Actions (SSR) hasta Client Components con estado controlado. Los Server Actions permiten procesar formularios directamente en el servidor sin crear API routes, mientras que los Client Components ofrecen mayor interactividad y validación en tiempo real. Esta guía muestra ambos enfoques usando un blog con Users, Posts y Tags, conectando formularios con Prisma.

---

## 📊 Schema de Prisma

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id      Int       @id @default(autoincrement())
  title   String
  content String?
  userId  Int
  user    User      @relation(fields: [userId], references: [id])
  postTags PostTag[]
}

model Tag {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  postTags PostTag[]
}

model PostTag {
  postId Int
  tagId  Int
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([postId, tagId])
}
```

---

## 🎯 Dos enfoques principales

| Enfoque | Cuándo usar | Ventajas | Desventajas |
|---------|-------------|----------|-------------|
| **Server Component + Server Action** | Formularios simples, CRUD básico | Sin JavaScript necesario, más seguro, menos código | Menos interactividad |
| **Client Component + Estado** | Formularios complejos, validación en tiempo real | Mayor interactividad, UX mejorada | Más código, requiere JavaScript |

---

## 1️⃣ Server Component + Server Action (SSR)

### Características
- ✅ Sin `'use client'`
- ✅ Sin `useState` ni `useEffect`
- ✅ Formularios no controlados
- ✅ Progressive enhancement (funciona sin JS)
- ✅ Acceso directo a Prisma

### `actions/users.js`

```js
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createUser(formData) {
  const name = formData.get('name')
  const email = formData.get('email')

  // Validación básica
  if (!name || name.length < 2) {
    return { error: 'El nombre debe tener al menos 2 caracteres' }
  }

  if (!email || !email.includes('@')) {
    return { error: 'Email inválido' }
  }

  try {
    await prisma.user.create({
      data: { name, email }
    })

    revalidatePath('/users')
    redirect('/users')
  } catch (error) {
    if (error.code === 'P2002') {
      return { error: 'Este email ya está registrado' }
    }
    return { error: 'Error al crear usuario' }
  }
}
```

### `app/users/create/page.jsx` - Formulario no controlado

```jsx
import { createUser } from '@/actions/users'

export default function CreateUserPage() {
  return (
    <div>
      <h1>Crear Usuario</h1>
      
      <form action={createUser}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            required 
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            required 
          />
        </div>

        <button type="submit">Crear</button>
      </form>
    </div>
  )
}
```

**💡 Ventajas:**
- Código mínimo
- Funciona sin JavaScript
- Más seguro (todo en servidor)

**⚠️ Desventajas:**
- No muestra errores sin recargar
- No hay feedback visual inmediato
- No hay validación en tiempo real

---

## 2️⃣ Server Component + useFormState (Híbrido)

### Características
- ✅ Server Action pero con feedback del cliente
- ✅ Manejo de errores sin recargar
- ✅ Estados de loading
- ⚠️ Necesita `'use client'`

### `actions/users.js`

```js
export async function createUser(prevState, formData) {
  const name = formData.get('name')
  const email = formData.get('email')

  if (!name || name.length < 2) {
    return { error: 'El nombre debe tener al menos 2 caracteres' }
  }

  if (!email || !email.includes('@')) {
    return { error: 'Email inválido' }
  }

  try {
    await prisma.user.create({
      data: { name, email }
    })

    revalidatePath('/users')
    return { success: true, message: 'Usuario creado correctamente' }
  } catch (error) {
    if (error.code === 'P2002') {
      return { error: 'Este email ya está registrado' }
    }
    return { error: 'Error al crear usuario' }
  }
}
```

### `app/users/create/page.jsx` - Con useFormState

```jsx
'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { createUser } from '@/actions/users'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creando...' : 'Crear Usuario'}
    </button>
  )
}

export default function CreateUserPage() {
  const router = useRouter()
  const [state, formAction] = useFormState(createUser, null)

  // Redirigir si fue exitoso
  useEffect(() => {
    if (state?.success) {
      router.push('/users')
    }
  }, [state, router])

  return (
    <div>
      <h1>Crear Usuario</h1>
      
      {state?.error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {state.error}
        </div>
      )}

      <form action={formAction}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            required 
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            required 
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
```

**💡 Ventajas:**
- Muestra errores sin recargar
- Estados de loading
- Mejor UX que Server Component puro

**⚠️ Desventajas:**
- Necesita Client Component
- Más código que Server puro

---

## 3️⃣ Client Component + Formulario Controlado

### Características
- ✅ Control total del formulario
- ✅ Validación en tiempo real
- ✅ Mejor UX interactiva
- ⚠️ Más código
- ⚠️ Requiere JavaScript

### `app/users/create/page.jsx` - Formulario controlado

```jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Validación en tiempo real
  function validateField(name, value) {
    let error = ''
    
    if (name === 'name' && value.length < 2) {
      error = 'El nombre debe tener al menos 2 caracteres'
    }
    
    if (name === 'email' && !value.includes('@')) {
      error = 'Email inválido'
    }
    
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error })
        setLoading(false)
        return
      }

      router.push('/users')
    } catch (error) {
      setErrors({ general: 'Error al crear usuario' })
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Crear Usuario</h1>
      
      {errors.general && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required 
          />
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>

        <button type="submit" disabled={loading || Object.values(errors).some(e => e)}>
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  )
}
```

### `app/api/users/route.js` - API Route necesaria

```js
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { name, email } = await request.json()

    if (!name || name.length < 2) {
      return Response.json({ error: 'El nombre debe tener al menos 2 caracteres' }, { status: 400 })
    }

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Email inválido' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: { name, email }
    })

    return Response.json(user, { status: 201 })
  } catch (error) {
    if (error.code === 'P2002') {
      return Response.json({ error: 'Este email ya está registrado' }, { status: 400 })
    }
    return Response.json({ error: 'Error al crear usuario' }, { status: 500 })
  }
}
```

---

## 4️⃣ Formulario complejo: Crear Post con Tags (M:M)

### Con Server Action + useFormState

```jsx
'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { createPost } from '@/actions/posts'
import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creando...' : 'Crear Post'}
    </button>
  )
}

export default function CreatePostPage({ users, tags }) {
  const router = useRouter()
  const [state, formAction] = useFormState(createPost, null)

  useEffect(() => {
    if (state?.success) {
      router.push('/posts')
    }
  }, [state, router])

  return (
    <div>
      <h1>Crear Post</h1>
      
      {state?.error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {state.error}
        </div>
      )}

      <form action={formAction}>
        <div>
          <label htmlFor="title">Título:</label>
          <input 
            type="text" 
            id="title"
            name="title" 
            required 
          />
        </div>

        <div>
          <label htmlFor="content">Contenido:</label>
          <textarea 
            id="content"
            name="content" 
            rows="5"
          />
        </div>

        <div>
          <label htmlFor="userId">Autor:</label>
          <select id="userId" name="userId" required>
            <option value="">Seleccionar...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Tags:</label>
          {tags.map(tag => (
            <div key={tag.id}>
              <input 
                type="checkbox" 
                name="tags" 
                value={tag.id} 
                id={`tag-${tag.id}`}
              />
              <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
            </div>
          ))}
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}

// Cargar datos en Server Component
export async function getData() {
  const [users, tags] = await Promise.all([
    prisma.user.findMany(),
    prisma.tag.findMany()
  ])
  return { users, tags }
}
```

### `actions/posts.js`

```js
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createPost(prevState, formData) {
  const title = formData.get('title')
  const content = formData.get('content')
  const userId = parseInt(formData.get('userId'))
  const tagIds = formData.getAll('tags').map(id => parseInt(id))

  if (!title || title.length < 3) {
    return { error: 'El título debe tener al menos 3 caracteres' }
  }

  if (!userId) {
    return { error: 'Debes seleccionar un autor' }
  }

  try {
    await prisma.post.create({
      data: {
        title,
        content: content || null,
        userId,
        postTags: {
          create: tagIds.map(tagId => ({ tagId }))
        }
      }
    })

    revalidatePath('/posts')
    return { success: true }
  } catch (error) {
    return { error: 'Error al crear post' }
  }
}
```

---

## 5️⃣ Validación con Zod (Recomendado)

```bash
npm install zod
```

### `lib/validations.js`

```js
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido')
})

export const postSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  content: z.string().optional(),
  userId: z.number().int().positive(),
  tagIds: z.array(z.number().int().positive()).optional()
})
```

### `actions/users.js` con Zod

```js
import { userSchema } from '@/lib/validations'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createUser(prevState, formData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email')
  }

  // Validar con Zod
  const validation = userSchema.safeParse(data)

  if (!validation.success) {
    return {
      error: validation.error.errors[0].message
    }
  }

  try {
    await prisma.user.create({
      data: validation.data
    })

    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    if (error.code === 'P2002') {
      return { error: 'Este email ya está registrado' }
    }
    return { error: 'Error al crear usuario' }
  }
}
```

---

## 📊 Comparación final

| Característica | Server Action Puro | useFormState | Client Controlado |
|----------------|-------------------|--------------|-------------------|
| **Código** | Mínimo | Medio | Mucho |
| **JavaScript necesario** | ❌ No | ✅ Sí | ✅ Sí |
| **Validación en tiempo real** | ❌ No | ❌ No | ✅ Sí |
| **Errores sin recargar** | ❌ No | ✅ Sí | ✅ Sí |
| **Estados de loading** | ❌ No | ✅ Sí | ✅ Sí |
| **Progressive enhancement** | ✅ Sí | ⚠️ Parcial | ❌ No |
| **Seguridad** | ✅✅ Alta | ✅✅ Alta | ✅ Media |

---

## 🚀 Mejores prácticas

- ✅ Usa **Server Actions** para formularios simples (CRUD básico)
- ✅ Usa **useFormState** cuando necesites feedback sin recargar
- ✅ Usa **Client Controlado** para formularios complejos con validación en tiempo real
- ✅ Valida SIEMPRE en el servidor (nunca confíes solo en el cliente)
- ✅ Usa **Zod** para validaciones robustas
- ✅ Usa `revalidatePath()` después de mutaciones
- ✅ Maneja errores de Prisma (especialmente `P2002` para duplicados)
- ✅ Proporciona feedback visual (loading, errores, éxito)
- ✅ Usa `useFormStatus` para mostrar estados de loading
- ✅ Considera progressive enhancement para mejor accesibilidad