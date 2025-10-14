# 🌀 Animaciones con Framer Motion en React/Next

> Cómo agregar animaciones simples y limpias con Framer Motion: entrada, salida, hover y listas.

---

## 1️⃣ Instalación

```bash
npm install framer-motion
# o
yarn add framer-motion
```

---

## 2️⃣ Animación básica de entrada (fade + slide)

```tsx
import { motion } from 'framer-motion'

export const Box = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}  // estado inicial
      animate={{ opacity: 1, y: 0 }}   // animación a ejecutar
      exit={{ opacity: 0, y: 20 }}     // animación al desmontar
    >
      <p>¡Hola, Framer Motion!</p>
    </motion.div>
  )
}
```

---

## 3️⃣ Animación al hacer hover

```tsx
import { motion } from 'framer-motion'

export const HoverButton = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: '#f0f' }}
      whileTap={{ scale: 0.95 }}
    >
      Hover y Click
    </motion.button>
  )
}
```

---

## 4️⃣ Animar listas con `AnimatePresence`

```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export const TodoList = () => {
  const [items, setItems] = useState(['Tarea 1', 'Tarea 2'])

  return (
    <div>
      <button onClick={() => setItems([...items, `Tarea ${items.length + 1}`])}>
        Agregar
      </button>
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
```