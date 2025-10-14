# 🧩 NEXTJS - Carpetas dinámicas y uso de `params`

> Crear un flujo completo para manejar rutas dinámicas en Next.js usando carpetas con corchetes `[param]` y accediendo a los parámetros desde la URL.

---

## 📁 Estructura del proyecto

```md
app/
├── layout.tsx
├── page.tsx
├── components/
│   └── Navbar.tsx
└── category/
    └── [categoryModel]/
        └── page.tsx
```

---

## 📄 `app/components/Navbar.tsx`

```tsx
"use client" // Componente cliente para manejar enlaces y eventos de usuario
import Link from "next/link"

export default function Navbar() {
  return (
    <nav>
      {/* Enlaces hacia diferentes rutas, incluyendo rutas dinámicas */}
      <Link href="/">Inicio</Link>
      <Link href="/category/work">Trabajo</Link>
      <Link href="/category/personal">Personal</Link>
      <Link href="/category/ideas">Ideas</Link>
    </nav>
  )
}
```

---

## 📄 `app/layout.tsx`

```tsx
// Layout raíz que envuelve todas las páginas
import Navbar from "./components/Navbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Mostrar Navbar en todas las páginas */}
        <Navbar />
        {/* Renderizar el contenido de la página correspondiente */}
        {children}
      </body>
    </html>
  )
}
```

---

## 📄 `app/category/[categoryModel]/page.tsx`

```tsx
// Página dinámica: el nombre entre [] crea la ruta dinámica
// Ejemplo: /category/work -> params.categoryModel = "work"
export default function CategoryPage({ params }: { params: { categoryModel: string } }) {
  return (
    <section>
      {/* Mostrar el parámetro recibido desde la URL */}
      <h1>Categoría: {params.categoryModel}</h1>
      <p>Mostrando notas relacionadas con {params.categoryModel}.</p>
    </section>
  )
}
```
