# 🟢 Zustand en React

> Cómo usar Zustand para manejo de estado global con ejemplos simples de un contador.

---

## 1️⃣ Zustand sin TypeScript

### Crear store

```jsx
import create from 'zustand'

export const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}))
```

### Uso en un componente

```jsx
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
```

---

## 2️⃣ Zustand con TypeScript

### Definir tipos y crear store

```tsx
import create from 'zustand'

// Definir tipos del store
interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

// Crear store con tipado
export const useStoreTS = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}))
```

### Uso en un componente, CounterComponent

```tsx
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
```
