# 📝 CRUD completo con Server Actions - Blog App

> CRUD completo usando Server Actions para un blog con usuarios, perfiles, posts y tags.

---

## 📁 Estructura del proyecto

```
app/
├── users/
│   ├── page.jsx
│   ├── create/page.jsx
│   └── [id]/
│       ├── page.jsx
│       └── edit/page.jsx
├── posts/
│   ├── page.jsx
│   ├── create/page.jsx
│   └── [id]/
│       ├── page.jsx
│       └── edit/page.jsx
└── tags/
    ├── page.jsx
    └── create/page.jsx

actions/
├── users.js
├── posts.js
└── tags.js

lib/
└── prisma.js
```

---

## 🔧 Setup: Cliente Prisma

### `lib/prisma.js`

```js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
```

---

## 👤 CRUD de Usuarios

### `actions/users.js`

```js
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Listar usuarios
export async function getUsers() {
  return await prisma.user.findMany({
    include: {
      profile: true,
      _count: { select: { posts: true } }
    },
    orderBy: { id: 'desc' }
  })
}

// Obtener usuario por ID
export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      profile: true,
      posts: {
        include: {
          postTags: {
            include: { tag: true }
          }
        }
      }
    }
  })
}

// Crear usuario
export async function createUser(formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const bio = formData.get('bio')

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
    redirect('/users')
  } catch (error) {
    if (error.code === 'P2002') {
      return { error: 'Este email ya está registrado' }
    }
    return { error: 'Error al crear usuario' }
  }
}

// Actualizar usuario
export async function updateUser(id, formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const bio = formData.get('bio')

  if (!name || name.length < 2) {
    return { error: 'El nombre debe tener al menos 2 caracteres' }
  }

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
    redirect('/users')
  } catch (error) {
    return { error: 'Error al actualizar usuario' }
  }
}

// Eliminar usuario
export async function deleteUser(id) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) }
    })

    revalidatePath('/users')
    redirect('/users')
  } catch (error) {
    return { error: 'Error al eliminar usuario' }
  }
}
```

### `app/users/page.jsx` - Listar usuarios

```jsx
import Link from 'next/link'
import { getUsers } from '@/actions/users'
import DeleteUserButton from './DeleteUserButton'

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      <h1>Usuarios</h1>
      <Link href="/users/create">Crear Usuario</Link>
      
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
            {user.profile && <p>Bio: {user.profile.bio}</p>}
            <small>{user._count.posts} posts</small>
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

### `app/users/create/page.jsx` - Crear usuario

```jsx
import { createUser } from '@/actions/users'

export default function CreateUserPage() {
  return (
    <div>
      <h1>Crear Usuario</h1>
      
      <form action={createUser}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="name" required />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>

        <div>
          <label>Bio:</label>
          <textarea name="bio" rows="3"></textarea>
        </div>

        <button type="submit">Crear</button>
      </form>
    </div>
  )
}
```

### `app/users/[id]/page.jsx` - Ver usuario

```jsx
import Link from 'next/link'
import { getUserById } from '@/actions/users'
import { notFound } from 'next/navigation'

export default async function UserDetailPage({ params }) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) notFound()

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      {user.profile && <p>Bio: {user.profile.bio}</p>}

      <h2>Posts ({user.posts.length})</h2>
      <ul>
        {user.posts.map(post => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
            <div>
              {post.postTags.map(pt => (
                <span key={pt.tagId}>{pt.tag.name}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <Link href={`/users/${user.id}/edit`}>Editar Usuario</Link>
    </div>
  )
}
```

### `app/users/[id]/edit/page.jsx` - Editar usuario

```jsx
import { getUserById, updateUser } from '@/actions/users'
import { notFound } from 'next/navigation'

export default async function EditUserPage({ params }) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) notFound()

  const updateUserWithId = updateUser.bind(null, id)

  return (
    <div>
      <h1>Editar Usuario</h1>
      
      <form action={updateUserWithId}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="name" defaultValue={user.name} required />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" defaultValue={user.email} required />
        </div>

        <div>
          <label>Bio:</label>
          <textarea name="bio" rows="3" defaultValue={user.profile?.bio || ''}></textarea>
        </div>

        <button type="submit">Actualizar</button>
      </form>
    </div>
  )
}
```

### `app/users/DeleteUserButton.jsx` - Botón eliminar

```jsx
'use client'
import { deleteUser } from '@/actions/users'

export default function DeleteUserButton({ userId }) {
  async function handleDelete() {
    if (!confirm('¿Eliminar usuario?')) return
    await deleteUser(userId)
  }

  return <button onClick={handleDelete}>Eliminar</button>
}
```

---

## 📰 CRUD de Posts

### `actions/posts.js`

```js
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Listar posts
export async function getPosts() {
  return await prisma.post.findMany({
    include: {
      user: true,
      postTags: {
        include: { tag: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Obtener post por ID
export async function getPostById(id) {
  return await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      postTags: {
        include: { tag: true }
      }
    }
  })
}

// Crear post
export async function createPost(formData) {
  const title = formData.get('title')
  const content = formData.get('content')
  const userId = parseInt(formData.get('userId'))
  const tagIds = formData.getAll('tags').map(id => parseInt(id))

  if (!title || title.length < 3) {
    return { error: 'El título debe tener al menos 3 caracteres' }
  }

  if (!userId) {
    return { error: 'Debes seleccionar un usuario' }
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
    redirect('/posts')
  } catch (error) {
    return { error: 'Error al crear post' }
  }
}

// Actualizar post
export async function updatePost(id, formData) {
  const title = formData.get('title')
  const content = formData.get('content')
  const tagIds = formData.getAll('tags').map(id => parseInt(id))

  if (!title || title.length < 3) {
    return { error: 'El título debe tener al menos 3 caracteres' }
  }

  try {
    await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content: content || null,
        postTags: {
          deleteMany: {},
          create: tagIds.map(tagId => ({ tagId }))
        }
      }
    })

    revalidatePath('/posts')
    redirect('/posts')
  } catch (error) {
    return { error: 'Error al actualizar post' }
  }
}

// Eliminar post
export async function deletePost(id) {
  try {
    await prisma.post.delete({
      where: { id: parseInt(id) }
    })

    revalidatePath('/posts')
    redirect('/posts')
  } catch (error) {
    return { error: 'Error al eliminar post' }
  }
}
```

### `app/posts/page.jsx` - Listar posts

```jsx
import Link from 'next/link'
import { getPosts } from '@/actions/posts'
import DeletePostButton from './DeletePostButton'

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div>
      <h1>Posts</h1>
      <Link href="/posts/create">Crear Post</Link>
      
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>Por: {post.user.name}</p>
            <div>
              Tags: {post.postTags.map(pt => pt.tag.name).join(', ')}
            </div>
            <div>
              <Link href={`/posts/${post.id}`}>Ver</Link>
              <Link href={`/posts/${post.id}/edit`}>Editar</Link>
              <DeletePostButton postId={post.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### `app/posts/create/page.jsx` - Crear post

```jsx
import { createPost } from '@/actions/posts'
import { getUsers } from '@/actions/users'
import { getTags } from '@/actions/tags'

export default async function CreatePostPage() {
  const [users, tags] = await Promise.all([getUsers(), getTags()])

  return (
    <div>
      <h1>Crear Post</h1>
      
      <form action={createPost}>
        <div>
          <label>Título:</label>
          <input type="text" name="title" required />
        </div>

        <div>
          <label>Contenido:</label>
          <textarea name="content" rows="5"></textarea>
        </div>

        <div>
          <label>Autor:</label>
          <select name="userId" required>
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
              <input type="checkbox" name="tags" value={tag.id} id={`tag-${tag.id}`} />
              <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
            </div>
          ))}
        </div>

        <button type="submit">Crear</button>
      </form>
    </div>
  )
}
```

### `app/posts/[id]/edit/page.jsx` - Editar post

```jsx
import { getPostById, updatePost } from '@/actions/posts'
import { getTags } from '@/actions/tags'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }) {
  const { id } = await params
  const [post, tags] = await Promise.all([
    getPostById(id),
    getTags()
  ])

  if (!post) notFound()

  const updatePostWithId = updatePost.bind(null, id)
  const selectedTagIds = post.postTags.map(pt => pt.tagId)

  return (
    <div>
      <h1>Editar Post</h1>
      
      <form action={updatePostWithId}>
        <div>
          <label>Título:</label>
          <input type="text" name="title" defaultValue={post.title} required />
        </div>

        <div>
          <label>Contenido:</label>
          <textarea name="content" rows="5" defaultValue={post.content || ''}></textarea>
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
                defaultChecked={selectedTagIds.includes(tag.id)}
              />
              <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
            </div>
          ))}
        </div>

        <button type="submit">Actualizar</button>
      </form>
    </div>
  )
}
```

### `app/posts/DeletePostButton.jsx`

```jsx
'use client'
import { deletePost } from '@/actions/posts'

export default function DeletePostButton({ postId }) {
  async function handleDelete() {
    if (!confirm('¿Eliminar post?')) return
    await deletePost(postId)
  }

  return <button onClick={handleDelete}>Eliminar</button>
}
```

---

## 🏷️ CRUD de Tags

### `actions/tags.js`

```js
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Listar tags
export async function getTags() {
  return await prisma.tag.findMany({
    include: {
      _count: { select: { postTags: true } }
    },
    orderBy: { name: 'asc' }
  })
}

// Crear tag
export async function createTag(formData) {
  const name = formData.get('name')

  if (!name || name.length < 2) {
    return { error: 'El nombre debe tener al menos 2 caracteres' }
  }

  try {
    await prisma.tag.create({
      data: { name }
    })

    revalidatePath('/tags')
    redirect('/tags')
  } catch (error) {
    if (error.code === 'P2002') {
      return { error: 'Este tag ya existe' }
    }
    return { error: 'Error al crear tag' }
  }
}

// Eliminar tag
export async function deleteTag(id) {
  try {
    await prisma.tag.delete({
      where: { id: parseInt(id) }
    })

    revalidatePath('/tags')
    revalidatePath('/posts')
  } catch (error) {
    return { error: 'Error al eliminar tag' }
  }
}
```

### `app/tags/page.jsx` - Listar tags

```jsx
import Link from 'next/link'
import { getTags } from '@/actions/tags'
import DeleteTagButton from './DeleteTagButton'

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div>
      <h1>Tags</h1>
      <Link href="/tags/create">Crear Tag</Link>
      
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            <strong>{tag.name}</strong>
            <small>({tag._count.postTags} posts)</small>
            <DeleteTagButton tagId={tag.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### `app/tags/create/page.jsx` - Crear tag

```jsx
import { createTag } from '@/actions/tags'

export default function CreateTagPage() {
  return (
    <div>
      <h1>Crear Tag</h1>
      
      <form action={createTag}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="name" required />
        </div>

        <button type="submit">Crear</button>
      </form>
    </div>
  )
}
```

### `app/tags/DeleteTagButton.jsx`

```jsx
'use client'
import { deleteTag } from '@/actions/tags'

export default function DeleteTagButton({ tagId }) {
  async function handleDelete() {
    if (!confirm('¿Eliminar tag?')) return
    await deleteTag(tagId)
  }

  return <button onClick={handleDelete}>Eliminar</button>
}
```

---

## 🏠 Página principal

### `app/page.jsx`

```jsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <h1>Blog App</h1>
      <nav>
        <Link href="/users">Usuarios</Link>
        <Link href="/posts">Posts</Link>
        <Link href="/tags">Tags</Link>
      </nav>
    </div>
  )
}
```

---

## 🚀 Resumen

- ✅ CRUD completo de Users (con Profile)
- ✅ CRUD completo de Posts (con Tags M:M)
- ✅ CRUD completo de Tags
- ✅ Validaciones básicas
- ✅ Manejo de errores
- ✅ Sin CSS, solo HTML
- ✅ Server Actions en carpeta `/actions`
- ✅ Revalidación automática con `revalidatePath()`