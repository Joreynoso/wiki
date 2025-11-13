# Guía de Reusabilidad en React

## Introducción

La reusabilidad es uno de los pilares fundamentales de React. Permite escribir código que puede ser utilizado en múltiples lugares de tu aplicación, reduciendo la duplicación y facilitando el mantenimiento.

## Patrones de Reusabilidad

### 1. Compound Components Pattern

Este patrón permite crear componentes que trabajan juntos compartiendo estado implícito. Es ideal para componentes complejos con múltiples partes interconectadas.

#### Ejemplo: Sistema de Menú

```javascript
import React from "react"
import useToggle from "./useToggle"

const MenuContext = React.createContext()

// Componente principal que maneja el estado
function Menu({ children, onOpen }) {
    const [open, toggleOpen] = useToggle(false, onOpen)
    
    return (
        <MenuContext.Provider value={{ open, toggleOpen }}>
            <div className="menu">{children}</div>
        </MenuContext.Provider>
    )
}

// Sub-componentes que acceden al contexto compartido
function MenuButton({ children }) {
    const { toggleOpen } = React.useContext(MenuContext)
    return <button onClick={toggleOpen}>{children}</button>
}

function MenuDropdown({ children }) {
    const { open } = React.useContext(MenuContext)
    return open ? <div className="menu-dropdown">{children}</div> : null
}

function MenuItem({ children }) {
    return <div className="menu-item">{children}</div>
}

// Composición final
Menu.Button = MenuButton
Menu.Dropdown = MenuDropdown
Menu.Item = MenuItem

export default Menu
```

**Uso:**
```jsx
<Menu onOpen={() => console.log("Toggle!")}>
  <Menu.Button>Opciones</Menu.Button>
  <Menu.Dropdown>
    <Menu.Item>Inicio</Menu.Item>
    <Menu.Item>Perfil</Menu.Item>
    <Menu.Item>Configuración</Menu.Item>
  </Menu.Dropdown>
</Menu>
```

**Ventajas:**
- API intuitiva y semántica
- Flexibilidad en la estructura
- Estado compartido automáticamente
- Fácil de extender

**Desventajas:**
- Requiere Context API
- Puede ser complejo para casos simples

---

### 2. Render Props Pattern

Este patrón utiliza una función como children (o prop) para compartir lógica entre componentes. El componente padre controla la lógica y pasa datos a través de la función render.

#### Ejemplo: Toggle Reutilizable

```javascript
function Toggle({ children, onToggle }) {
    const [on, setOn] = React.useState(false)
    
    const toggle = () => {
        setOn(prev => !prev)
        onToggle?.(!on)
    }
    
    // children es una función que recibe el estado y métodos
    return children({ on, toggle })
}

// Uso con diferentes UIs
function App() {
    return (
        <div>
            {/* Ejemplo 1: Botón simple */}
            <Toggle onToggle={(state) => console.log(state)}>
                {({ on, toggle }) => (
                    <button onClick={toggle}>
                        {on ? "Encendido 💡" : "Apagado 🌙"}
                    </button>
                )}
            </Toggle>
            
            {/* Ejemplo 2: Menú desplegable */}
            <Toggle>
                {({ on, toggle }) => (
                    <div>
                        <button onClick={toggle}>
                            {on ? "▼" : "▶"} Menú
                        </button>
                        {on && (
                            <ul>
                                <li>Opción 1</li>
                                <li>Opción 2</li>
                                <li>Opción 3</li>
                            </ul>
                        )}
                    </div>
                )}
            </Toggle>
            
            {/* Ejemplo 3: Modal */}
            <Toggle>
                {({ on, toggle }) => (
                    <div>
                        <button onClick={toggle}>Abrir Modal</button>
                        {on && (
                            <div className="modal">
                                <h2>Modal</h2>
                                <p>Contenido del modal</p>
                                <button onClick={toggle}>Cerrar</button>
                            </div>
                        )}
                    </div>
                )}
            </Toggle>
        </div>
    )
}
```

**Ventajas:**
- Máxima flexibilidad en el renderizado
- No necesita Context API
- Lógica reutilizable con diferentes UIs
- Control total sobre lo que se renderiza

**Desventajas:**
- Sintaxis puede ser verbosa
- "Wrapper hell" si se anidan muchos
- Menos intuitivo para principiantes

---

### 3. Custom Hooks

Los hooks personalizados encapsulan lógica reutilizable que puede ser compartida entre componentes.

#### Ejemplo: useToggle Hook

```javascript
function useToggle(initialValue = false, callback) {
    const [on, setOn] = React.useState(initialValue)
    
    const toggle = () => {
        setOn(prev => {
            const newValue = !prev
            callback?.(newValue)
            return newValue
        })
    }
    
    return [on, toggle, setOn]
}

// Uso en diferentes componentes
function LightSwitch() {
    const [isOn, toggle] = useToggle(false, (state) => {
        console.log(`Luz: ${state ? "ON" : "OFF"}`)
    })
    
    return (
        <button onClick={toggle}>
            {isOn ? "💡 Luz Encendida" : "🌙 Luz Apagada"}
        </button>
    )
}

function AccordionItem({ title, content }) {
    const [isOpen, toggle] = useToggle(false)
    
    return (
        <div>
            <button onClick={toggle}>
                {isOpen ? "▼" : "▶"} {title}
            </button>
            {isOpen && <p>{content}</p>}
        </div>
    )
}
```

**Ventajas:**
- Sintaxis limpia y simple
- Fácil de testear
- Composición natural con otros hooks
- No afecta la estructura JSX

**Desventajas:**
- Solo comparte lógica, no UI
- Requiere React 16.8+

---

## Comparación de Patrones

| Patrón | Mejor para | Reusabilidad | Complejidad | Flexibilidad UI |
|--------|-----------|--------------|-------------|-----------------|
| **Compound Components** | Componentes con múltiples partes relacionadas | ⭐⭐⭐⭐ | Media-Alta | Media |
| **Render Props** | Lógica reutilizable con UI variable | ⭐⭐⭐⭐⭐ | Media | Máxima |
| **Custom Hooks** | Lógica de estado y efectos | ⭐⭐⭐⭐⭐ | Baja | N/A (solo lógica) |

## Cuándo Usar Cada Patrón

### Usa Compound Components cuando:
- Tienes un componente con múltiples partes que deben trabajar juntas
- Quieres una API declarativa y flexible
- Necesitas compartir estado entre componentes relacionados
- Ejemplo: Tabs, Accordion, Menu, Modal con Header/Body/Footer

### Usa Render Props cuando:
- Necesitas máxima flexibilidad en el renderizado
- La misma lógica debe producir UIs completamente diferentes
- Quieres dar control total al consumidor del componente
- Ejemplo: Toggle, Dropdown, Data fetching components

### Usa Custom Hooks cuando:
- Solo necesitas compartir lógica, no UI
- Quieres composición simple de comportamientos
- La lógica es independiente de la presentación
- Ejemplo: useToggle, useFetch, useLocalStorage, useDebounce

## Combinando Patrones

Puedes combinar estos patrones para crear soluciones más poderosas:

```javascript
// Custom Hook + Render Props
function useMousePosition() {
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    
    React.useEffect(() => {
        const handleMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [])
    
    return position
}

function MouseTracker({ render }) {
    const position = useMousePosition()
    return render(position)
}

// Uso
<MouseTracker 
    render={({ x, y }) => (
        <h1>La posición del mouse es: ({x}, {y})</h1>
    )}
/>
```

## Mejores Prácticas

1. **Empieza simple**: Usa custom hooks para lógica, componentes simples para UI
2. **Evalúa la flexibilidad necesaria**: No sobre-ingenierices
3. **Documenta tu API**: Especialmente importante para compound components
4. **Mantén la separación de responsabilidades**: Lógica vs presentación
5. **Prueba la reusabilidad**: Si es difícil reutilizar, refactoriza

## Conclusión

La reusabilidad en React no es solo sobre escribir menos código, sino sobre crear abstracciones claras, mantenibles y flexibles. Cada patrón tiene su lugar, y elegir el correcto depende de tus necesidades específicas.