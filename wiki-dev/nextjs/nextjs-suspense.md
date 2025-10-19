# ⏳ Next.js - Suspense para cargar datos

> Suspense es una característica de React que permite manejar estados de carga asíncronos de forma declarativa. En Next.js App Router, Suspense trabaja junto con Server Components para mejorar el rendimiento mediante streaming: el servidor envía primero el "shell" de la página (layouts, navegación) y luego transmite el contenido dinámico a medida que está listo. Esto permite mostrar algo al usuario inmediatamente mientras se cargan partes pesadas de la página en segundo plano.

---

## 📦 Instalación

Suspense viene incluido en React (no necesita instalación extra).

```jsx
import { Suspense } from 'react'
```

---

## 1️⃣ Ejemplo básico: Componente con carga lenta

### Componente que carga datos (async)

```jsx
// app/components/UserList.jsx
async function UserList() {
  // Simulamos una llamada a API lenta
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const users = ['Ana', 'Juan', 'María']
  
  return (
    <ul>
      {users.map(user => (
        <li key={user}>{user}</li>
      ))}
    </ul>
  )
}

export default UserList
```

### Página que usa Suspense

```jsx
// app/page.jsx
import { Suspense } from 'react'
import UserList from './components/UserList'

export default function Home() {
  return (
    <main>
      <h1>Mi App</h1>
      
      <Suspense fallback={<p>Cargando usuarios...</p>}>
        <UserList />
      </Suspense>
    </main>
  )
}
```

**¿Qué hace?** Mientras `UserList` carga los datos, muestra "Cargando usuarios...". Cuando termina, lo reemplaza con la lista.

---

## 2️⃣ Ejemplo con múltiples Suspense

```jsx
import { Suspense } from 'react'
import Posts from './components/Posts'
import Comments from './components/Comments'

export default function BlogPage() {
  return (
    <main>
      <h1>Blog</h1>
      
      {/* Posts se carga independiente de Comments */}
      <Suspense fallback={<div>Cargando posts...</div>}>
        <Posts />
      </Suspense>
      
      <Suspense fallback={<div>Cargando comentarios...</div>}>
        <Comments />
      </Suspense>
    </main>
  )
}
```

**¿Qué hace?** Cada sección se carga de forma independiente. Si Posts termina antes que Comments, se muestra aunque Comments siga cargando.

---

## 3️⃣ Ejemplo con fetch real

### Componente async que hace fetch

```jsx
// app/components/Products.jsx
async function Products() {
  const response = await fetch('https://api.example.com/products')
  const products = await response.json()
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}

export default Products
```

### Página con Suspense

```jsx
// app/page.jsx
import { Suspense } from 'react'
import Products from './components/Products'

export default function Home() {
  return (
    <main>
      <h1>Tienda</h1>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <Products />
      </Suspense>
    </main>
  )
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
    </div>
  )
}
```

---

## 💡 Conceptos clave

### ✅ Qué hace Suspense

- Muestra un fallback mientras el componente carga
- Permite streaming SSR (enviar HTML en partes)
- Mejora la experiencia de usuario mostrando contenido parcial

### ⚠️ Importante

- El componente dentro de Suspense **debe ser async** (Server Component)
- Suspense solo funciona en Next.js App Router (no en Pages Router)
- Cada Suspense puede tener su propio fallback independiente

### 🎯 Cuándo usar Suspense

- Componentes que hacen fetch de datos
- Componentes pesados que tardan en renderizar
- Secciones de la página que pueden cargarse después del contenido principal

---

## 🔄 Alternativa: archivo `loading.js`

Next.js también permite crear un archivo `loading.js` en la misma carpeta que `page.js`:

```jsx
// app/loading.jsx
export default function Loading() {
  return <p>Cargando página...</p>
}
```

Esto envuelve automáticamente tu página en Suspense, pero es menos flexible que usar Suspense manualmente.
