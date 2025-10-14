# 🌗 Theme Context - Dark / Light Mode con React y TailwindCSS

> Cómo crear un contexto global para manejar tema oscuro/claro en una app React usando TailwindCSS, con persistencia en localStorage.

---

## 1️⃣ Contexto React para Tema

```jsx
import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext(null)

export default function ThemeProvider({ children }) {
  // Estado del tema, por defecto "ligth" o valor en localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'ligth'
  })

  // Función para alternar tema
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'ligth' : 'dark')
  }

  // Aplicar clase en <html> y persistir en localStorage
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add("dark")
    else root.classList.remove("dark")

    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

---

## 2️⃣ Uso del `ThemeContext` en un componente

```jsx
import { useContext } from "react"
import { ThemeContext } from "./ThemeProvider"

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <button onClick={toggleTheme}>
      Cambiar a {theme === 'dark' ? 'claro' : 'oscuro'}
    </button>
  )
}
```

---

## 3️⃣ TailwindCSS - Configuración dark mode

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

---

## 4️⃣ Ejemplo de uso en JSX con Tailwind

```jsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 p-4">
  <h1>Hola Mundo</h1>
  <ThemeSwitcher />
</div>
```
