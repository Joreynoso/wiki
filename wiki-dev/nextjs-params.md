# 🧩 NEXTJS - Carpetas dinámicas y uso de `params`

/*
META: Crear un flujo completo para manejar rutas dinámicas en Next.js:
1️⃣ Crear un layout raíz (`layout.tsx`) que incluya la Navbar.
2️⃣ Crear un componente cliente de Navbar con enlaces hacia rutas dinámicas.
3️⃣ Crear carpetas dinámicas con corchetes `[param]` para recibir parámetros desde la URL.
4️⃣ En el componente de la ruta dinámica, usar `params` para mostrar datos según la URL.
5️⃣ Explicar cómo navegar y acceder a los parámetros dinámicos sin estilos ni frameworks externos.
*/

## 📄 Estructura del proyecto

app/
├─ layout.tsx
├─ components/
│ └─ Navbar.tsx
├─ category/
│ ├─ [categoryModel]/
│ │ └─ page.tsx
└─ page.tsx

## 📄 Código principal

### 🧱 `app/components/Navbar.tsx`

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

// -----------------------------------------------------------------
// -----------------------------------------------------------------


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

// -----------------------------------------------------------------
// -----------------------------------------------------------------

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

