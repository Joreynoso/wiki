# ⚡ Next.js App Router: Loading, NotFound y Error

> Explicar cómo manejar los estados comunes de una página en Next.js: `loading`, `not-found` y `error`.

---

## 1️⃣ Loading (componente de carga)

```tsx
// app/loading.tsx
export default function Loading() {
  return <p>Cargando...</p>
}
```

---

## 2️⃣ NotFound (componente de página no encontrada)

```tsx
// app/not-found.tsx
export default function NotFoundPage() {
  return <p>Página no encontrada</p>
}
```

### Uso manual desde un page

```tsx
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: { id: string }}) {
  const product = await fetch(`https://api.example.com/products/${params.id}`)
    .then(res => res.json())

  if (!product) return notFound()

  return <p>Producto: {product.name}</p>
}
```

---

## 3️⃣ Error (componente de error)

```tsx
// app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <p>Ocurrió un error: {error.message}</p>
      <button onClick={() => reset()}>Reintentar</button>
    </div>
  )
}
```
