# 🚀 Next.js + Prisma - CRUD con Server Actions

> Server Actions son funciones asíncronas que se ejecutan en el servidor. Permiten realizar mutaciones de datos directamente desde componentes sin necesidad de crear API routes. Al colocar las Server Actions en una carpeta separada fuera de `/app`, todos los archivos en esa carpeta son automáticamente Server Actions sin necesidad de usar la directiva `'use server'` en cada función.

---

## 📁 Estructura de carpetas

```
my-app/
├── app/
│   ├── users/
│   │   ├── page.jsx
│   │   └── create/
│   │       └── page.jsx
│   └── layout.jsx
├── actions/
│   └── users.js          // ← Server Actions (sin 'use server')
├── lib/
│   └── prisma.js
└── prisma/
    └── schema.prisma
```

**📌 Importante:** Los archivos dentro de `/actions` son automáticamente Server Actions. No necesitan la directiva `'use server'`.

---

## 🔧 Crear archivo de Server Actions

### `actions/users.js`

```js
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ✅ Listar todos los usuarios
export async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      _count: {
        select: { posts: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return users
}

// ✅ Obtener usuario por ID
export async function getUserById(id) {
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
  
  return user
}

// ✅ Crear usuario
export async function createUser(formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const bio = formData.get('bio')

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        profile: bio ? {
          create: { bio }
        } : undefined
      }
    })

    revalidatePath('/users')
    redirect('/users')
  } catch (error) {
    return { error: error.message }
  }
}

// ✅ Actualizar usuario
export async function updateUser(id, formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const bio = formData.get('bio')

  try {
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        profile: bio ? {
          upsert: {
            create: { bio },
            update: { bio }
          }
        } : undefined
      }
    })

    revalidatePath('/users')
    revalidatePath(`/users/${id}`)
    redirect('/users')
  } catch (error) {
    return { error: error.message }
  }
}

// ✅ Eliminar usuario
export async function deleteUser(id) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) }
    })

    revalidatePath('/users')
    redirect('/users')
  } catch (error) {
    return { error: error.message }
  }
}
```

---

## 1️⃣ Listar usuarios

### `app/users/page.jsx`

```jsx
import { getUsers } from '@/actions/users'
import Link from 'next/link'

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      <div>
        <h1>Usuarios</h1>
        <Link href="/users/create">
          <button>Crear Usuario</button>
        </Link>
      </div>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            <div>
              <strong>{user.name}</strong>
              <p>{user.email}</p>
              {user.profile && <p>Bio: {user.profile.bio}</p>}
              <span>{user._count.posts} posts</span>
            </div>
            <div>
              <Link href={`/users/${user.id}`}>Ver</Link>
              <Link href={`/users/${user.id}/edit`}>Editar</Link>
              <DeleteUserButton userId={user.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 2️⃣ Crear usuario

### `app/users/create/page.jsx`

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

        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
          />
        </div>

        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  )
}
```

**✅ Ventajas:**
- Sin `'use client'`
- Sin `useState`
- Sin `fetch`
- Funciona sin JavaScript en el cliente

---

## 3️⃣ Ver usuario por ID

### `app/users/[id]/page.jsx`

```jsx
import { getUserById } from '@/actions/users'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function UserDetailPage({ params }) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      {user.profile && (
        <div>
          <h2>Perfil</h2>
          <p>{user.profile.bio}</p>
        </div>
      )}

      <div>
        <h2>Posts ({user.posts.length})</h2>
        <ul>
          {user.posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.published ? 'Publicado' : 'Borrador'}</p>
              <div>
                {post.categories.map(cat => (
                  <span key={cat.id}>{cat.name}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Link href={`/users/${user.id}/edit`}>
        <button>Editar</button>
      </Link>
    </div>
  )
}
```

---

## 4️⃣ Actualizar usuario

### `app/users/[id]/edit/page.jsx`

```jsx
import { getUserById, updateUser } from '@/actions/users'
import { notFound } from 'next/navigation'

export default async function EditUserPage({ params }) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  const updateUserWithId = updateUser.bind(null, id)

  return (
    <div>
      <h1>Editar Usuario</h1>
      
      <form action={updateUserWithId}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name || ''}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={user.email}
            required
          />
        </div>

        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            defaultValue={user.profile?.bio || ''}
          />
        </div>

        <button type="submit">Actualizar Usuario</button>
      </form>
    </div>
  )
}
```

**💡 Truco:** Usamos `.bind(null, id)` para pre-cargar el ID en la función.

---

## 5️⃣ Eliminar usuario

### Componente de botón (Client Component)

```jsx
'use client'
import { deleteUser } from '@/actions/users'

export default function DeleteUserButton({ userId }) {
  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) {
      return
    }

    await deleteUser(userId)
  }

  return (
    <button onClick={handleDelete}>
      Eliminar
    </button>
  )
}
```

**⚠️ Nota:** Para `onClick` necesitamos un Client Component, pero la acción sigue ejecutándose en el servidor.

---

## 6️⃣ Crear post con categorías (M:M)

### `actions/posts.js`

```js
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData) {
  const title = formData.get('title')
  const content = formData.get('content')
  const authorId = parseInt(formData.get('authorId'))
  const published = formData.get('published') === 'on'
  
  // Obtener IDs de categorías seleccionadas
  const categoryIds = formData.getAll('categories').map(id => parseInt(id))

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId,
        categories: {
          connect: categoryIds.map(id => ({ id }))
        }
      }
    })

    revalidatePath('/posts')
    redirect('/posts')
  } catch (error) {
    return { error: error.message }
  }
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
}
```

### `app/posts/create/page.jsx`

```jsx
import { createPost, getCategories } from '@/actions/posts'
import { getUsers } from '@/actions/users'

export default async function CreatePostPage() {
  const [users, categories] = await Promise.all([
    getUsers(),
    getCategories()
  ])

  return (
    <div>
      <h1>Crear Post</h1>
      
      <form action={createPost}>
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
            rows="6"
          />
        </div>

        <div>
          <label htmlFor="authorId">Autor:</label>
          <select id="authorId" name="authorId" required>
            <option value="">Seleccionar...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Categorías:</label>
          {categories.map(category => (
            <div key={category.id}>
              <input
                type="checkbox"
                id={`cat-${category.id}`}
                name="categories"
                value={category.id}
              />
              <label htmlFor={`cat-${category.id}`}>
                {category.name}
              </label>
            </div>
          ))}
        </div>

        <div>
          <input
            type="checkbox"
            id="published"
            name="published"
          />
          <label htmlFor="published">Publicar</label>
        </div>

        <button type="submit">Crear Post</button>
      </form>
    </div>
  )
}
```

---

## 7️⃣ Formulario con validación y feedback

### `actions/users.js` (con validación)

```js
export async function createUser(prevState, formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const bio = formData.get('bio')

  // Validación
  if (!name || name.length < 2) {
    return { error: 'El nombre debe tener al menos 2 caracteres' }
  }

  if (!email || !email.includes('@')) {
    return { error: 'Email inválido' }
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        profile: bio ? {
          create: { bio }
        } : undefined
      }
    })

    revalidatePath('/users')
    return { success: true, message: 'Usuario creado correctamente' }
  } catch (error) {
    if (error.code === 'P2002') {
      return { error: 'Este email ya está registrado' }
    }
    return { error: error.message }
  }
}
```

### Formulario con `useFormState` y `useFormStatus`

```jsx
'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { createUser } from '@/actions/users'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creando...' : 'Crear Usuario'}
    </button>
  )
}

export default function CreateUserForm() {
  const [state, formAction] = useFormState(createUser, null)

  return (
    <form action={formAction}>
      {state?.error && (
        <div style={{ color: 'red' }}>
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div style={{ color: 'green' }}>
          {state.message}
        </div>
      )}

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

      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          rows="4"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
```

---

## 💡 Conceptos clave

### `revalidatePath()`
Invalida el caché de una ruta específica para que se regenere.

```js
revalidatePath('/users')           // Revalida /users
revalidatePath('/users/[id]', 'page') // Revalida una página dinámica
```

### `redirect()`
Redirige a otra página después de una mutación.

```js
redirect('/users')
redirect(`/users/${newUser.id}`)
```

### `.bind()` para pre-cargar argumentos
```js
const updateUserWithId = updateUser.bind(null, userId)
```

### `useFormState` para feedback
Maneja el estado del formulario y muestra errores/éxitos.

### `useFormStatus` para loading states
Muestra si el formulario está enviándose.

---

## 🎯 Ventajas de Server Actions

| Aspecto | API Routes (fetch) | Server Actions |
|---------|-------------------|----------------|
| Código | Más código | Menos código |
| JavaScript | Necesario | Opcional (progressive enhancement) |
| Revalidación | Manual | Automática con `revalidatePath` |
| Seguridad | Expone endpoint público | Solo callable desde componentes |
| TypeScript | Tipos separados | Inferencia automática |
| Organización | `/app/api/` | `/actions/` |

---

## 🚀 Mejores prácticas

- ✅ Coloca Server Actions en `/actions` para evitar `'use server'` repetido
- ✅ Usa `revalidatePath()` después de mutaciones
- ✅ Usa `redirect()` para navegación después de crear/editar
- ✅ Valida datos en el servidor, no confíes solo en el cliente
- ✅ Retorna objetos con `{ error }` o `{ success }` para feedback
- ✅ Usa `useFormState` y `useFormStatus` para UX mejorada
- ✅ Maneja errores de Prisma (como `P2002` para duplicados)
- ✅ Usa `.bind()` para pre-cargar IDs en acciones de edición/eliminación