# 🟢 Zustand en React

/*
META: Explicar cómo usar Zustand para manejo de estado global.

- Ejemplo simple de un contador.
- Versiones con y sin TypeScript.

*/

---

## 1️⃣ Zustand sin TypeScript

```jsx
import create from 'zustand'

// 1️⃣ Crear store
export const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}))

// 2️⃣ Uso en un componente
export const CounterComponent = () => {
  const { count, increment, decrement, reset } = useStore()
  
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

## 2️⃣ Zustand con TypeScript

import create from 'zustand'

// 1️⃣ Definir tipos del store
interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

// 2️⃣ Crear store con tipado
export const useStoreTS = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}))

// 3️⃣ Uso en un componente
export const CounterComponentTS = () => {
  const { count, increment, decrement, reset } = useStoreTS()

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

