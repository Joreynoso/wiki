# 🧩 NEXTJS - Layout específico para una ruta secundaria

/*
META: Crear un layout que afecte solo a una subruta (ej. /dashboard) sin afectar el layout principal de la app.
1️⃣ Definir un archivo `layout.tsx` dentro de la carpeta de la ruta secundaria.
2️⃣ Incluir navegación o menú lateral propio del dashboard.
3️⃣ Renderizar las páginas hijas usando `{children}`.
4️⃣ Mantener separado del layout principal para modularidad y reuso.
*/

## 📁 Estructura del proyecto

app/
├─ layout.tsx // Layout global de la app
├─ page.tsx // Página principal
└─ dashboard/
├─ layout.tsx // Layout específico del dashboard
└─ page.tsx // Página del dashboard

---

## 🧱 `app/dashboard/layout.tsx`

```tsx
// Layout específico para la ruta /dashboard
// Todas las páginas dentro de /dashboard usarán este layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {/* Navbar o menú lateral propio del dashboard */}
      <nav>
        <ul>
          <li>Inicio</li>
          <li>Usuarios</li>
          <li>Configuración</li>
        </ul>
      </nav>

      {/* Contenido dinámico que renderiza cada página hija */}
      <div>
        {children}
      </div>
    </section>
  )
}

// Página principal del dashboard
// Se renderiza dentro del layout de dashboard
export default function DashboardPage() {
  return <h2>Bienvenido al panel</h2>
}
