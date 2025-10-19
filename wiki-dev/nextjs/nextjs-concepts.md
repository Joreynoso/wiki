# 🚀 Next.js - Guía completa de conceptos fundamentales

> Next.js es un framework de React poderoso que puede resultar confuso al principio. Esta guía desglosa sus conceptos centrales de forma clara y práctica.

**📺 Video recomendado:** [Next.js Complete Guide](https://www.youtube.com/watch?v=tfF4Z5WHa_0)

---

## 📁 Routing (Enrutamiento basado en archivos)

### File-based routing

En Next.js, las rutas se crean mediante la estructura de carpetas dentro del directorio `app`:

- Cada carpeta representa un segmento de la URL
- Los archivos `page.tsx` definen el contenido de la ruta
- Las rutas hijas se crean anidando carpetas

```md
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
└── products/
    └── page.tsx          → /products
```

### Rutas dinámicas

Se crean usando corchetes en el nombre de la carpeta:

```md
app/
└── products/
    └── [id]/
        └── page.tsx      → /products/123
```

Para acceder a los parámetros dinámicos:

```jsx
export default async function ProductPage({ params }) {
  const { id } = await params
  return <h1>Producto {id}</h1>
}
```

### Route Groups (Grupos de rutas)

Los paréntesis en nombres de carpetas organizan código sin afectar la URL:

```md
app/
├── (public)/
│   ├── about/page.tsx    → /about
│   └── contact/page.tsx  → /contact
└── (admin)/
    └── dashboard/page.tsx → /dashboard
```

---

## 🔗 Navegación

### Link Component

Usa `Link` de `next/link` en lugar de `<a>` para navegación del lado del cliente y pre-fetching:

```jsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Inicio</Link>
      <Link href="/about">Acerca de</Link>
    </nav>
  )
}
```

**Ventajas:**

- Navegación sin recargar la página
- Pre-carga automática de páginas enlazadas
- Mejor rendimiento

---

## 🎨 Layouts

Los archivos `layout.tsx` definen UI compartida que persiste entre rutas:

```jsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}  {/* Solo esta parte cambia entre rutas */}
        <Footer />
      </body>
    </html>
  )
}
```

**Características:**

- Solo el contenido `{children}` se re-renderiza
- Ideales para navbars, sidebars y footers
- Se pueden anidar para layouts específicos de secciones

---

## ⚙️ Server Components vs Client Components

### Server Components (por defecto)

Se ejecutan **solo en el servidor**:

```jsx
// No necesita 'use client'
async function UserList() {
  const users = await fetchUsers()
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

**Ventajas:**

- Mejor rendimiento
- Bundle de JavaScript más pequeño
- Acceso directo a bases de datos

### Client Components

Requieren la directiva `'use client'` para interactividad:

```jsx
'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Cuándo usar:**

- Hooks de React (`useState`, `useEffect`, etc.)
- Event listeners (`onClick`, `onChange`, etc.)
- Acceso al navegador (`localStorage`, `window`, etc.)

---

## 📊 Data Fetching (Obtención de datos)

### En Server Components (recomendado)

```jsx
async function Products() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  
  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  )
}
```

### Data Access Layer

Organiza y asegura el acceso a datos creando una capa separada:

```jsx
// lib/data.js
import 'server-only'  // Asegura que solo se use en el servidor

export async function getProducts() {
  const res = await fetch('https://api.example.com/products')
  return res.json()
}
```

---

## ⏳ Streaming y Loading States

### Opción 1: Archivo `loading.tsx`

Next.js envuelve automáticamente la página en Suspense:

```jsx
// app/products/loading.tsx
export default function Loading() {
  return <div>Cargando productos...</div>
}
```

### Opción 2: Suspense manual

Mayor control sobre qué partes cargan independientemente:

```jsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <main>
      <h1>Tienda</h1>
      <Suspense fallback={<div>Cargando...</div>}>
        <Products />
      </Suspense>
    </main>
  )
}
```

---

## 🔄 Mutations (Modificación de datos)

### Server Actions

Funciones asíncronas que se ejecutan en el servidor:

```jsx
'use server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData) {
  const name = formData.get('name')
  
  // Guardar en DB
  await db.products.create({ name })
  
  // Limpiar caché
  revalidatePath('/products')
}
```

Uso en formularios:

```jsx
import { createProduct } from './actions'

export default function Form() {
  return (
    <form action={createProduct}>
      <input name="name" />
      <button type="submit">Crear</button>
    </form>
  )
}
```

### Route Handlers (API Routes)

Para endpoints públicos o externos:

```jsx
// app/api/products/route.js
export async function GET() {
  const products = await db.products.findMany()
  return Response.json(products)
}

export async function POST(request) {
  const data = await request.json()
  const product = await db.products.create({ data })
  return Response.json(product)
}
```

---

## 🛡️ Middleware

Archivo en la raíz del proyecto que intercepta requests:

```jsx
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

**Usos comunes:**

- Autenticación
- Redirecciones
- Modificar headers
- Logging

---

## 🔍 Metadata API (SEO)

### Metadata estático

```jsx
// app/page.tsx
export const metadata = {
  title: 'Mi App',
  description: 'Descripción de mi app',
  openGraph: {
    title: 'Mi App',
    description: 'Descripción para redes sociales',
    images: ['/og-image.jpg']
  }
}

export default function Page() {
  return <h1>Inicio</h1>
}
```

### Metadata dinámico

```jsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)
  
  return {
    title: product.name,
    description: product.description
  }
}
```

---

## ❌ Error Handling

Archivo `error.tsx` para manejar errores inesperados:

```jsx
'use client'  // Debe ser Client Component

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>¡Algo salió mal!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Intentar de nuevo</button>
    </div>
  )
}
```

---

## 💾 Caching y Rendering

### Rendering dinámico vs estático

**Dinámico (genera HTML en cada request):**

- Usa funciones dinámicas: `cookies()`, `headers()`, `searchParams`

- Tiene middleware que modifica la respuesta
- Usa `dynamic = 'force-dynamic'`

**Estático (genera HTML en build time):**

- No usa funciones dinámicas
- Datos cacheados por defecto
- Mejor rendimiento

### Control de caché

```jsx
// Revalidación incremental (ISR)
export const revalidate = 3600  // cada hora

// Forzar dinámico
export const dynamic = 'force-dynamic'

// Forzar estático
export const dynamic = 'force-static'
```

### Cache en fetch

```jsx
// Sin caché
fetch(url, { cache: 'no-store' })

// Con revalidación
fetch(url, { next: { revalidate: 3600 } })

// Cache por defecto
fetch(url)
```

---

## 📚 Resumen de archivos especiales

| Archivo | Propósito |
|---------|-----------|
| `page.tsx` | Define el contenido de una ruta |
| `layout.tsx` | UI compartida entre rutas |
| `loading.tsx` | Estado de carga automático |
| `error.tsx` | Manejo de errores |
| `not-found.tsx` | Página 404 personalizada |
| `route.ts` | API endpoint (Route Handler) |
| `middleware.ts` | Intercepta requests |

---

## 💡 Mejores prácticas

- ✅ Usa Server Components por defecto, Client Components solo cuando necesites interactividad
- ✅ Crea una capa de acceso a datos separada con `server-only`
- ✅ Usa `Link` para navegación, nunca `<a>`
- ✅ Implementa Suspense para mejor UX durante cargas
- ✅ Combina middleware con verificaciones en el data layer para seguridad
- ✅ Define metadata para mejor SEO
- ✅ Usa `revalidatePath` después de mutaciones para actualizar caché
