# 🔹 Render Props y Children en React

/*

META: Mostrar cómo usar Render Props y el prop children en React.

- Render Props: pasar una función para renderizar contenido dinámico.
- Children: pasar JSX dentro de un componente padre.
- Ejemplos simples para comprender su funcionamiento.

*/

---

## 1️⃣ Children en React

```tsx
// Componente padre que recibe children
export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: 10 }}>
      {children} {/* renderiza lo que se pase entre etiquetas */}
    </div>
  )
}

// Uso
export const App = () => {
  return (
    <Card>
      <h2>Título dentro del Card</h2>
      <p>Este contenido se pasa como children.</p>
    </Card>
  )
}

---

## 2️⃣ Render Props

// Componente que recibe una función como prop
interface MouseProps {
  render: (x: number, y: number) => React.ReactNode
}

export const MouseTracker = ({ render }: MouseProps) => {
  const [coords, setCoords] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setCoords({ x: e.clientX, y: e.clientY })
  }

  return <div onMouseMove={handleMouseMove}>{render(coords.x, coords.y)}</div>
}

// Uso
export const App = () => {
  return (
    <MouseTracker render={(x, y) => <p>Posición del mouse: {x}, {y}</p>} />
  )
}

---

3️⃣ Children como función (funcional render prop)

interface CounterProps {
  children: (count: number, increment: () => void) => React.ReactNode
}

export const Counter = ({ children }: CounterProps) => {
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + 1)
  return <div>{children(count, increment)}</div>
}

// Uso
export const App = () => {
  return (
    <Counter>
      {(count, increment) => (
        <>
          <p>Contador: {count}</p>
          <button onClick={increment}>Incrementar</button>
        </>
      )}
    </Counter>
  )
}

