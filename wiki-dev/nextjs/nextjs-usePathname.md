# 🧭 Navbar simple con Next.js `usePathname` - Links explícitos

> Crear una Navbar mínima con enlaces escritos a mano y resaltar el activo usando `usePathname`.

---

## 📄 Código del componente `Navbar`

```tsx
"use client"

import Link from "next/link"
import NavLink from "@/app/components/NavLink"
import { usePathname } from "next/navigation"
import PFLogoIcon from "@/public/printforge-logo-icon.svg"
import PFLogo from "@/public/printforge-logo.svg"

export default function Navbar() {

  const pathname = usePathname()

  return (
    <header className="w-full bg-white">
      <nav className="flex justify-between px-6 py-4 pr-2">
        <Link href="/">
          <div className="relative cursor-pointer">
            {/* Desktop Logo */}
            <img
              src={PFLogo.src}
              alt="PrintForge Logo"
              className="w-[200px] h-auto hidden md:block"
            />
            {/* Mobile Logo */}
            <img
              src={PFLogoIcon.src}
              alt="PrintForge Logo"
              className="w-[40px] h-auto block md:hidden"
            />
          </div>
        </Link>
        <ul className="flex items-center gap-1.5">
          <NavLink href="/3d-models" isActive={pathname === "/3d-models"}>3D Models</NavLink>
          <NavLink href="/about" isActive={pathname === "/about"}>About</NavLink>

          <NavLink href="/about" isActive={pathname.startsWith === "/about"}>About</NavLink> // para nested Routes
        </ul>
      </nav>
    </header>
  )
}
```

---

## 📄 Código del componente `NavLink`

```tsx
"use client"

import Link from "next/link"
import type { NavLinkProps } from "@/app/types"

export default function NavLink({ href, children, isActive }: NavLinkProps) {

  return (
    <li className="text-sm uppercase">
      <Link
        href={href}
        className={`px-4 py-2 transition-colors rounded-md cursor-pointer hover:text-orange-accent ${isActive ? "text-orange-accent" : "text-gray-700"}`}
      >{children}</Link>
    </li>
  )
}
```

**Nota:** `children` permite tener `<NavLink>Children va Aquí</NavLink>`

---

## 🧠 Explicación breve

- `usePathname()` devuelve el pathname actual (p. ej. `/`, `/about`, `/notes/123`) y solo funciona en componentes cliente
- Hacemos `console.log("pathname:", pathname)` para comprobar exactamente qué valor llega y ajustar la lógica de comparación si usás slugs o rutas anidadas
- Aquí se usa una comparación exacta (`pathname === link.href`). Si necesitás marcar rutas anidadas (por ejemplo `/notes/123` → activo `/notes`), reemplazá la comparación por `pathname.startsWith(link.href)` para abarcar subrutas
- El componente es mínimo y se puede colocar en `app/layout.tsx` para que aparezca en todas las páginas
