# ⚡ Custom Hooks en React

/*
META: Explicar cómo crear y usar custom hooks en React.

- Ejemplos simples para incrementar contadores o manejar inputs.
- Con y sin TypeScript.

*/

---

## 1️⃣ Custom Hook simple sin TypeScript

```jsx
import { useState } from 'react'

// Hook para manejar un contador
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(initialValue)

  return { count, increment, decrement, reset }
}

// Uso en un componente
export function CounterComponent() {
  const { count, increment, decrement, reset } = useCounter(5)

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

---

## 2️⃣ Custom Hook simple con TypeScript

import { useState } from 'react'

// Hook para manejar un contador con tipado
export function useCounterTS(initialValue: number = 0) {
  const [count, setCount] = useState<number>(initialValue)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(initialValue)

  return { count, increment, decrement, reset }
}

// Uso en un componente
export const CounterComponentTS = () => {
  const { count, increment, decrement, reset } = useCounterTS(10)

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
