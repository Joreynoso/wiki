# 🧩 React Context simple con custom hook

> Crear un contexto simple que maneje un estado global y un custom hook que lo consuma.

---

## 📄 Código del contexto

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'

// 1️⃣ Crear el contexto con tipo opcional
interface CounterContextType {
  count: number
  increment: () => void
  decrement: () => void
}

const CounterContext = createContext<CounterContextType | undefined>(undefined)

// 2️⃣ Provider
export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)

  return (
    <CounterContext.Provider value={{ count, increment, decrement }}>
      {children}
    </CounterContext.Provider>
  )
}

// 3️⃣ Custom hook
export const useCounter = () => {
  const context = useContext(CounterContext)
  if (!context) throw new Error('useCounter debe usarse dentro de CounterProvider')
  return context
}
```

---

## 📄 Uso del custom hook

```tsx
import { useCounter } from './CounterContext'

export function Counter() {
  const { count, increment, decrement } = useCounter()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```
