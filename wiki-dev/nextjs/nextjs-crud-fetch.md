# 🌐 CRUD completo con Fetch + API Routes - Blog App

> CRUD completo usando Fetch y API Routes tradicionales para un blog con usuarios, perfiles, posts y tags.

---

## 📁 Estructura del proyecto

```
app/
├── api/
│   ├── users/
│   │   ├── route.js
│   │   └── [id]/route.js
│   ├── posts/
│   │   ├── route.js
│   │   └── [id]/route.js
│   └── tags/
│       ├── route.js
│       └── [id]/route.js
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

lib/
├── prisma.js
└── api.js
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

## 🌐 API Routes - Usuarios

### `app/api/users/route.js`

```js
import prisma from '@/lib/prisma'

// GET - Listar usuarios
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        _count: { select: { posts: true } }
      },
      orderBy: { id: 'desc' }
    })

    return Response.json(users)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST - Crear usuario
export async function POST(request) {
  try {
    const { name, email, bio } = await request.json()

    if (!name || name.length < 2) {
      return Response.json({ error: 'El nombre debe tener al menos 2 caracteres' }, { status: 400 })
    }

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Email inválido' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        profile: bio ? {
          create: { bio }
        } : undefined
      },
      include: { profile: true }
    })

    return Response.json(user, { status: 201 })
  } catch (error) {
    if (error.code === 'P2002') {
      return Response.json({ error: 'Este email ya está registrado' }, { status: 400 })
    }
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### `app/api/users/[id]/route.js`

```js
import prisma from '@/lib/prisma'

// GET - Obtener usuario por ID
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
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

    if (!user) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Actualizar usuario
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const { name, email, bio } = await request.json()

    if (!name || name.length < 2) {
      return Response.json({ error: 'El nombre debe tener al menos 2 caracteres' }, { status: 400 })
    }

    const user = await prisma.user.update({
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
      },
      include: { profile: true }
    })

    return Response.json(user)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Eliminar usuario
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await prisma.user.delete({
      where: { id: parseInt(id) }
    })

    return Response.json({ message: 'Usuario eliminado' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 🌐 API Routes - Posts

### `app/api/posts/route.js`

```js
import prisma from '@/lib/prisma'

// GET - Listar posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        postTags: {
          include: { tag: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return Response.json(posts)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST - Crear post
export async function POST(request) {
  try {
    const { title, content, userId, tagIds } = await request.json()

    if (!title || title.length < 3) {
      return Response.json({ error: 'El título debe tener al menos 3 caracteres' }, { status: 400 })
    }

    if (!userId) {
      return Response.json({ error: 'Debes seleccionar un usuario' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content: content || null,
        userId: parseInt(userId),
        postTags: {
          create: (tagIds || []).map(tagId => ({ tagId: parseInt(tagId) }))
        }
      },
      include: {
        user: true,
        postTags: {
          include: { tag: true }
        }
      }
    })

    return Response.json(post, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### `app/api/posts/[id]/route.js`

```js
import prisma from '@/lib/prisma'

// GET - Obtener post por ID
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        postTags: {
          include: { tag: true }
        }
      }
    })

    if (!post) {
      return Response.json({ error: 'Post no encontrado' }, { status: 404 })
    }

    return Response.json(post)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Actualizar post
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const { title, content, tagIds } = await request.json()

    if (!title || title.length < 3) {
      return Response.json({ error: 'El título debe tener al menos 3 caracteres' }, { status: 400 })
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content: content || null,
        postTags: {
          deleteMany: {},
          create: (tagIds || []).map(tagId => ({ tagId: parseInt(tagId) }))
        }
      },
      include: {
        user: true,
        postTags: {
          include: { tag: true }
        }
      }
    })

    return Response.json(post)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Eliminar post
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

## 🌐 API Routes - Tags

### `app/api/tags/route.js`

```js
import prisma from '@/lib/prisma'

// GET - Listar tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: { select: { postTags: true } }
      },
      orderBy: { name: 'asc' }
    })

    return Response.json(tags)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST - Crear tag
export async function POST(request) {
  try {
    const { name } = await request.json()

    if (!name || name.length < 2) {
      return Response.json({ error: 'El nombre debe tener al menos 2 caracteres' }, { status: 400 })
    }

    const tag = await prisma.tag.create({
      data: { name }
    })

    return Response.json(tag, { status: 201 })
  } catch (error) {
    if (error.code === 'P2002') {
      return Response.json({ error: 'Este tag ya existe' }, { status: 400 })
    }
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### `app/api/tags/[id]/route.js`

```js
import prisma from '@/lib/prisma'

// DELETE - Eliminar tag
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await prisma.tag.delete({
      where: { id: parseInt(id) }
    })

    return Response.json({ message: 'Tag eliminado' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 🔧 Helper: Funciones de API

### `lib/api.js`

```js
// Usuarios
export async function getUsers() {
  const res = await fetch('/api/users')
  return res.json()
}

export async function getUserById(id) {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

export async function createUser(data) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function updateUser(id, data) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteUser(id) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

// Posts
export async function getPosts() {
  const res = await fetch('/api/posts')
  return res.json()
}

export async function getPostById(id) {
  const res = await fetch(`/api/posts/${id}`)
  return res.json()
}

export async function createPost(data) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function updatePost(id, data) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deletePost(id) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

// Tags
export async function getTags() {
  const res = await fetch('/api/tags')
  return res.json()
}

export async function createTag(data) {
  const res = await fetch('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteTag(id) {
  const res = await fetch(`/api/tags/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}
```

---

## 👤 Componentes - Usuarios

### `app/users/page.jsx` - Listar usuarios

```jsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUsers, deleteUser } from '@/lib/api'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const data = await getUsers()
    setUsers(data)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar usuario?')) return
    await deleteUser(id)
    loadUsers()
  }

  if (loading) return <p>Cargando...</p>

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
              <button onClick={() => handleDelete(user.id)}>Eliminar</button>
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
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/api'

export default function CreateUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', bio: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await createUser(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/users')
    }
  }

  return (
    <div>
      <h1>Crear Usuario</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Bio:</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear'}
        </button>
      </form>
    </div>
  )
}
```

### `app/users/[id]/page.jsx` - Ver usuario

```jsx
'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { getUserById } from '@/lib/api'

export default function UserDetailPage({ params }) {
  const { id } = use(params)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const data = await getUserById(id)
    setUser(data)
    setLoading(false)
  }

  if (loading) return <p>Cargando...</p>
  if (!user || user.error) return <p>Usuario no encontrado</p>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      {user.profile && <p>Bio: {user.profile.bio}</p>}

      <h2>Posts ({user.posts?.length || 0})</h2>
      <ul>
        {user.posts?.map(post => (
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
'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { getUserById, updateUser } from '@/lib/api'

export default function EditUserPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', bio: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const data = await getUserById(id)
    if (!data.error) {
      setFormData({
        name: data.name,
        email: data.email,
        bio: data.profile?.bio || ''
      })
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const result = await updateUser(id, formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/users')
    }
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1>Editar Usuario</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Bio:</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            rows="3"
          />
        </div>

        <button type="submit">Actualizar</button>
      </form>
    </div>
  )
}
```

---

## 📰 Componentes - Posts

### `app/posts/page.jsx` - Listar posts

```jsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPosts, deletePost } from '@/lib/api'

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    const data = await getPosts()
    setPosts(data)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar post?')) return
    await deletePost(id)
    loadPosts()
  }

  if (loading) return <p>Cargando...</p>

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
              <button onClick={() => handleDelete(post.id)}>Eliminar</button>
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
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, getUsers, getTags } from '@/lib/api'

export default function CreatePostPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [tags, setTags] = useState([])
  const [formData, setFormData] = useState({ title: '', content: '', userId: '', tagIds: [] })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [usersData, tagsData] = await Promise.all([getUsers(), getTags()])
    setUsers(usersData)
    setTags(tagsData)
  }

  function handleTagChange(tagId) {
    const tagIdNum = parseInt(tagId)
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagIdNum)
        ? prev.tagIds.filter(id => id !== tagIdNum)
        : [...prev.tagIds, tagIdNum]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await createPost(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/posts')
    }
  }

  return (
    <div>
      <h1>Crear Post</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Contenido:</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows="5"
          />
        </div>

        <div>
          <label>Autor:</label>
          <select
            value={formData.userId}
            onChange={(e) => setFormData({...formData, userId: e.target.value})}
            required
          >
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
                checked={formData.tagIds.includes(tag.id)}
                onChange={() => handleTagChange(tag.id)}
                id={`tag-${tag.id}`}
              />
              <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear'}
        </button>
      </form>
    </div>
  )
}
```

### `app/posts/[id]/edit/page.jsx` - Editar post

```jsx
'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { getPostById, updatePost, getTags } from '@/lib/api'

export default function EditPostPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [tags, setTags] = useState([])
  const [formData, setFormData] = useState({ title: '', content: '', tagIds: [] })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [postData, tagsData] = await Promise.all([getPostById(id), getTags()])
    
    if (!postData.error) {
      setFormData({
        title: postData.title,
        content: postData.content || '',
        tagIds: postData.postTags.map(pt => pt.tagId)
      })
    }
    setTags(tagsData)
    setLoading(false)
  }

  function handleTagChange(tagId) {
    const tagIdNum = parseInt(tagId)
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagIdNum)
        ? prev.tagIds.filter(id => id !== tagIdNum)
        : [...prev.tagIds, tagIdNum]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const result = await updatePost(id, formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/posts')
    }
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1>Editar Post</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div>
          <label>Contenido:</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows="5"
          />
        </div>

        <div>
          <label>Tags:</label>
          {tags.map(tag => (
            <div key={tag.id}>
              <input
                type="checkbox"
                checked={formData.tagIds.includes(tag.id)}
                onChange={() => handleTagChange(tag.id)}
                id={`tag-${tag.id}`}
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

---

## 🏷️ Componentes - Tags

### `app/tags/page.jsx` - Listar tags

```jsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTags, deleteTag } from '@/lib/api'

export default function TagsPage() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTags()
  }, [])

  async function loadTags() {
    const data = await getTags()
    setTags(data)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar tag?')) return
    await deleteTag(id)
    loadTags()
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1>Tags</h1>
      <Link href="/tags/create">Crear Tag</Link>
      
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            <strong>{tag.name}</strong>
            <small>({tag._count.postTags} posts)</small>
            <button onClick={() => handleDelete(tag.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### `app/tags/create/page.jsx` - Crear tag

```jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTag } from '@/lib/api'

export default function CreateTagPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await createTag({ name })
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/tags')
    }
  }

  return (
    <div>
      <h1>Crear Tag</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear'}
        </button>
      </form>
    </div>
  )
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

- ✅ CRUD completo con API Routes (`/api`)
- ✅ Fetch con funciones helper en `/lib/api.js`
- ✅ Todos los componentes son Client Components (`'use client'`)
- ✅ Manejo de estados con `useState` y `useEffect`
- ✅ Validaciones básicas en cliente y servidor
- ✅ Manejo de errores
- ✅ Sin CSS, solo HTML puro