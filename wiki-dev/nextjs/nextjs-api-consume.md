# 🔌 Next.js + Prisma - Consumir API desde componentes

> Esta guía muestra la forma más sencilla de usar los endpoints de tu API de Prisma desde componentes de Next.js. Aprenderás a crear, leer, actualizar y eliminar usuarios usando `fetch` nativo de JavaScript.

---

## 📋 Endpoints disponibles

Basándonos en la API que creamos anteriormente:

- **GET** `/api/users` - Listar todos los usuarios
- **GET** `/api/users/[id]` - Obtener un usuario específico
- **POST** `/api/users` - Crear un nuevo usuario
- **PUT** `/api/users/[id]` - Actualizar un usuario
- **DELETE** `/api/users/[id]` - Eliminar un usuario

---

## 1️⃣ Listar usuarios (GET)

### En un Server Component

```jsx
// app/users/page.jsx
export default async function UsersPage() {
  const response = await fetch('http://localhost:3000/api/users')
  const users = await response.json()

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**✅ Ventajas:** Renderizado del lado del servidor, sin JavaScript en el cliente.

### En un Client Component

```jsx
'use client'
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 2️⃣ Crear usuario (POST)

```jsx
'use client'
import { useState } from 'react'

export default function CreateUserForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, bio })
      })

      if (!response.ok) {
        throw new Error('Error al crear usuario')
      }

      const newUser = await response.json()
      alert(`Usuario creado: ${newUser.name}`)
      
      // Limpiar formulario
      setName('')
      setEmail('')
      setBio('')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Usuario</h2>
      
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Bio:</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Usuario'}
      </button>
    </form>
  )
}
```

---

## 3️⃣ Obtener usuario por ID (GET)

```jsx
'use client'
import { useEffect, useState } from 'react'

export default function UserDetail({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <p>Cargando usuario...</p>
  if (!user) return <p>Usuario no encontrado</p>

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      {user.profile && <p>Bio: {user.profile.bio}</p>}
      
      <h3>Posts:</h3>
      <ul>
        {user.posts?.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 4️⃣ Actualizar usuario (PUT)

```jsx
'use client'
import { useState } from 'react'

export default function UpdateUserForm({ userId, currentName, currentEmail }) {
  const [name, setName] = useState(currentName)
  const [email, setEmail] = useState(currentEmail)
  const [loading, setLoading] = useState(false)

  async function handleUpdate(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      })

      if (!response.ok) {
        throw new Error('Error al actualizar usuario')
      }

      const updatedUser = await response.json()
      alert(`Usuario actualizado: ${updatedUser.name}`)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdate}>
      <h2>Actualizar Usuario</h2>
      
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </button>
    </form>
  )
}
```

---

## 5️⃣ Eliminar usuario (DELETE)

```jsx
'use client'
import { useState } from 'react'

export default function DeleteUserButton({ userId, userName }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`¿Estás seguro de eliminar a ${userName}?`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar usuario')
      }

      alert('Usuario eliminado correctamente')
      // Aquí podrías redirigir o actualizar la lista
      window.location.reload()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
```

---

## 6️⃣ CRUD completo en un solo componente

```jsx
'use client'
import { useEffect, useState } from 'react'

export default function UsersCRUD() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', bio: '' })

  // Cargar usuarios
  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const response = await fetch('/api/users')
    const data = await response.json()
    setUsers(data)
    setLoading(false)
  }

  // Crear usuario
  async function createUser(e) {
    e.preventDefault()
    
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    setFormData({ name: '', email: '', bio: '' })
    fetchUsers() // Recargar lista
  }

  // Eliminar usuario
  async function deleteUser(userId) {
    if (!confirm('¿Eliminar usuario?')) return

    await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })

    fetchUsers() // Recargar lista
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      {/* Formulario de creación */}
      <form onSubmit={createUser}>
        <h2>Crear Usuario</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <textarea
          placeholder="Bio"
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
        />
        <button type="submit">Crear</button>
      </form>

      {/* Lista de usuarios */}
      <h2>Lista de Usuarios</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
            <button onClick={() => deleteUser(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 💡 Mejores prácticas

### Manejo de errores completo

```jsx
async function fetchData() {
  try {
    const response = await fetch('/api/users')
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener datos:', error)
    return null
  }
}
```

### Revalidación automática con Router

```jsx
'use client'
import { useRouter } from 'next/navigation'

export default function CreateUser() {
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    // ... crear usuario
    
    router.refresh() // Revalida Server Components
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### Crear funciones reutilizables

```js
// lib/api.js
export async function getUsers() {
  const response = await fetch('/api/users')
  return response.json()
}

export async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  return response.json()
}

export async function deleteUser(userId) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE'
  })
  return response.json()
}
```

Luego usarlas:

```jsx
import { getUsers, createUser, deleteUser } from '@/lib/api'

// En tu componente
const users = await getUsers()
await createUser({ name: 'Ana', email: 'ana@example.com' })
await deleteUser(1)
```

---

## 🎯 Resumen

| Operación | Método HTTP | Endpoint | Body |
|-----------|-------------|----------|------|
| Listar usuarios | GET | `/api/users` | - |
| Obtener usuario | GET | `/api/users/[id]` | - |
| Crear usuario | POST | `/api/users` | `{ name, email, bio }` |
| Actualizar usuario | PUT | `/api/users/[id]` | `{ name, email }` |
| Eliminar usuario | DELETE | `/api/users/[id]` | - |

---

## 🚀 Tips finales

- ✅ Usa Client Components (`'use client'`) para formularios e interactividad
- ✅ Usa Server Components para mostrar datos estáticos
- ✅ Siempre maneja errores con `try/catch`
- ✅ Muestra estados de carga (`loading`)
- ✅ Valida datos antes de enviarlos
- ✅ Usa `router.refresh()` para actualizar Server Components después de mutaciones
- ✅ Crea funciones reutilizables en `/lib/api.js` para no repetir código