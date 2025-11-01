# 🎯 React Context API - Practical Examples

> React Context API proporciona una forma de compartir valores como temas, información de usuario o preferencias entre componentes sin tener que pasar props explícitamente a través de cada nivel del árbol de componentes. Es ideal para datos que pueden considerarse "globales" para un árbol de componentes React, como el usuario autenticado actual, un tema o un idioma preferido. Context resuelve el problema del "prop drilling" (pasar props a través de múltiples niveles) y simplifica el código al centralizar el estado compartido.

---

## 📋 ¿Cuándo usar Context?

### ✅ Usar Context cuando:
- Datos necesarios por muchos componentes a diferentes niveles
- Estado global de la aplicación (tema, idioma, auth)
- Evitar prop drilling excesivo
- Configuraciones compartidas

### ❌ NO usar Context cuando:
- Solo necesitas pasar datos 1-2 niveles
- El estado cambia muy frecuentemente (puede causar re-renders)
- Datos específicos de un componente

---

## 1️⃣ Ejemplo: Theme Switcher (Dark/Light Mode)

### `context/ThemeContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}
```

### Configurar en la app

```jsx
// App.jsx
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Content from './components/Content'

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <Content />
    </ThemeProvider>
  )
}
```

### Usar en componentes

```jsx
// components/Navbar.jsx
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav style={{ 
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000'
    }}>
      <h1>Mi App</h1>
      <button onClick={toggleTheme}>
        Cambiar a {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
    </nav>
  )
}
```

```jsx
// components/Content.jsx
import { useTheme } from '../context/ThemeContext'

export default function Content() {
  const { theme } = useTheme()

  return (
    <main style={{ 
      background: theme === 'dark' ? '#222' : '#f5f5f5',
      color: theme === 'dark' ? '#fff' : '#000',
      padding: '20px'
    }}>
      <h2>Contenido Principal</h2>
      <p>Tema actual: {theme}</p>
    </main>
  )
}
```

---

## 2️⃣ Ejemplo: User Authentication

### `context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
```

### Componentes usando Auth

```jsx
// components/LoginForm.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simular login
    login({ email, name: 'Usuario Demo' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

```jsx
// components/UserProfile.jsx
import { useAuth } from '../context/AuthContext'

export default function UserProfile() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div>
      <h2>Bienvenido, {user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  )
}
```

```jsx
// components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <p>Debes iniciar sesión para ver este contenido</p>
  }

  return children
}
```

---

## 3️⃣ Ejemplo: Shopping Cart

### `context/CartContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
```

### Componentes usando Cart

```jsx
// components/ProductCard.jsx
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart()

  const isInCart = cartItems.find(item => item.id === product.id)

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product)}>
        {isInCart ? 'Agregar más' : 'Agregar al carrito'}
      </button>
    </div>
  )
}
```

```jsx
// components/Cart.jsx
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalItems, 
    getTotalPrice,
    clearCart 
  } = useCart()

  if (cartItems.length === 0) {
    return <p>El carrito está vacío</p>
  }

  return (
    <div>
      <h2>Carrito ({getTotalItems()} items)</h2>
      
      {cartItems.map(item => (
        <div key={item.id}>
          <h4>{item.name}</h4>
          <p>${item.price} x {item.quantity}</p>
          
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            -
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            +
          </button>
          
          <button onClick={() => removeFromCart(item.id)}>
            Eliminar
          </button>
        </div>
      ))}

      <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
      <button onClick={clearCart}>Vaciar Carrito</button>
    </div>
  )
}
```

```jsx
// components/CartBadge.jsx
import { useCart } from '../context/CartContext'

export default function CartBadge() {
  const { getTotalItems } = useCart()

  return (
    <button>
      🛒 Carrito ({getTotalItems()})
    </button>
  )
}
```

---

## 4️⃣ Ejemplo: Language/Locale Selector

### `context/LanguageContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react'

const translations = {
  es: {
    welcome: 'Bienvenido',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    cart: 'Carrito',
    total: 'Total'
  },
  en: {
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
    cart: 'Cart',
    total: 'Total'
  },
  pt: {
    welcome: 'Bem-vindo',
    login: 'Entrar',
    logout: 'Sair',
    cart: 'Carrinho',
    total: 'Total'
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es')

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang)
    }
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de LanguageProvider')
  }
  return context
}
```

### Componentes usando Language

```jsx
// components/LanguageSelector.jsx
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage()

  return (
    <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
      <option value="es">Español</option>
      <option value="en">English</option>
      <option value="pt">Português</option>
    </select>
  )
}
```

```jsx
// components/Welcome.jsx
import { useLanguage } from '../context/LanguageContext'

export default function Welcome() {
  const { t } = useLanguage()

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('login')}</button>
    </div>
  )
}
```

---

## 🔗 Combinar múltiples Contexts

### Opción 1: Providers anidados

```jsx
// App.jsx
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
```

### Opción 2: Provider Wrapper

```jsx
// context/AppProviders.jsx
export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

// App.jsx
import AppProviders from './context/AppProviders'

export default function App() {
  return (
    <AppProviders>
      <MainApp />
    </AppProviders>
  )
}
```

---

## 💡 Patrón de Custom Hook

Siempre crear un custom hook para cada context:

```jsx
// ✅ BIEN - Con custom hook
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}

// Uso
const { theme, toggleTheme } = useTheme()
```

```jsx
// ❌ MAL - Sin custom hook
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

// Repetir esto en cada componente
const context = useContext(ThemeContext)
```

---

## ⚡ Optimización: Prevenir re-renders

### Problema: Todo se re-renderiza

```jsx
// ❌ MAL - Causa re-renders innecesarios
export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  
  return (
    <CartContext.Provider value={{ items, setItems }}>
      {children}
    </CartContext.Provider>
  )
}
```

### Solución: useMemo

```jsx
// ✅ BIEN - Memoiza el value
import { useMemo } from 'react'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  
  const value = useMemo(() => ({
    items,
    addItem: (item) => setItems(prev => [...prev, item])
  }), [items])
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
```

---

## 🚀 Mejores prácticas

- ✅ Crea un custom hook para cada Context
- ✅ Valida que el hook se use dentro del Provider
- ✅ Separa Contexts por responsabilidad (un Context por dominio)
- ✅ Usa `useMemo` para optimizar el value del Provider
- ✅ Coloca Providers lo más cerca posible de donde se necesitan
- ✅ Evita poner TODO el estado de la app en un solo Context
- ✅ Combina Context con otros hooks (useState, useReducer)
- ✅ Documenta qué datos provee cada Context
- ❌ No uses Context para estado que cambia muy frecuentemente
- ❌ No uses Context si solo necesitas pasar props 1-2 niveles