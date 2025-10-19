# 📋 JavaScript - Métodos para duplicar y copiar arrays

> El operador spread (`...`) expande un iterable (como un array o string) en lugares donde se esperan elementos individuales. Permite crear copias superficiales de arrays, combinar múltiples arrays, y expandir arrays en argumentos de funciones. A diferencia de asignar con `=` (que solo copia la referencia), el spread crea un nuevo array en memoria, evitando modificaciones accidentales del array original. Es especialmente útil para mantener inmutabilidad en programación funcional y frameworks de estado.

---

## 📊 Array de ejemplo

```js
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Juan' },
  { id: 3, name: 'María' }
]
```

---

## 1️⃣ Duplicar array en el mismo array (mutable)

### Usando `push()` con spread

```js
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Juan' }
]

users.push(...users)
console.log(users)
// [
//   { id: 1, name: 'Ana' },
//   { id: 2, name: 'Juan' },
//   { id: 1, name: 'Ana' },
//   { id: 2, name: 'Juan' }
// ]
```

**⚠️ Importante:** Esto **modifica el array original**.

---

## 2️⃣ Duplicar array en un nuevo array (inmutable)

### Usando spread operator

```js
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Juan' }
]

const duplicatedUsers = [...users, ...users]
console.log(duplicatedUsers)
// [
//   { id: 1, name: 'Ana' },
//   { id: 2, name: 'Juan' },
//   { id: 1, name: 'Ana' },
//   { id: 2, name: 'Juan' }
// ]

console.log(users)
// [
//   { id: 1, name: 'Ana' },
//   { id: 2, name: 'Juan' }
// ]
// ✅ El array original NO cambió
```

### Usando `concat()`

```js
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Juan' }
]

const duplicatedUsers = users.concat(users)
console.log(duplicatedUsers)
// [
//   { id: 1, name: 'Ana' },
//   { id: 2, name: 'Juan' },
//   { id: 1, name: 'Ana' },
//   { id: 2, name: 'Juan' }
// ]
```

---

## 3️⃣ Copiar array (clonar)

### Usando spread operator

```js
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Juan' }
]

const copiedUsers = [...users]

copiedUsers.push({ id: 3, name: 'Carlos' })

console.log(users.length)        // 2
console.log(copiedUsers.length)  // 3
// ✅ Son arrays independientes
```

### Usando `slice()`

```js
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Juan' }
]

const copiedUsers = users.slice()

copiedUsers.push({ id: 3, name: 'Carlos' })

console.log(users.length)        // 2
console.log(copiedUsers.length)  // 3
```

### Usando `Array.from()`

```js
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Juan' }
]

const copiedUsers = Array.from(users)
```

---

## 4️⃣ Combinar múltiples arrays

### Duplicar N veces con spread

```js
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Juan' }
]

// Triplicar
const tripledUsers = [...users, ...users, ...users]
console.log(tripledUsers.length)  // 6
```

### Combinar diferentes arrays

```js
const admins = [
  { id: 1, name: 'Ana', role: 'admin' }
]

const members = [
  { id: 2, name: 'Juan', role: 'member' },
  { id: 3, name: 'María', role: 'member' }
]

const allUsers = [...admins, ...members]
console.log(allUsers)
// [
//   { id: 1, name: 'Ana', role: 'admin' },
//   { id: 2, name: 'Juan', role: 'member' },
//   { id: 3, name: 'María', role: 'member' }
// ]
```

---

## 5️⃣ Diferencia entre copia y referencia

### ❌ Usando `=` (copia la referencia)

```js
const users = [{ id: 1, name: 'Ana' }]
const fakeUsers = users  // Solo copia la referencia

fakeUsers.push({ id: 2, name: 'Juan' })

console.log(users.length)      // 2 😱
console.log(fakeUsers.length)  // 2
// Ambos apuntan al mismo array en memoria
```

### ✅ Usando spread (crea nuevo array)

```js
const users = [{ id: 1, name: 'Ana' }]
const realCopy = [...users]  // Crea nuevo array

realCopy.push({ id: 2, name: 'Juan' })

console.log(users.length)     // 1 ✅
console.log(realCopy.length)  // 2
// Son arrays independientes
```

---

## 6️⃣ Spread vs Concat: Rendimiento

### Para arrays pequeños (< 10,000 elementos)

```js
// Spread - Más legible
const combined = [...users1, ...users2]

// Concat - Similar rendimiento
const combined = users1.concat(users2)
```

### Para arrays grandes (> 100,000 elementos)

```js
// Concat es MÁS RÁPIDO
const combined = users1.concat(users2)

// Spread es más lento en arrays grandes
const combined = [...users1, ...users2]
```

**Recomendación:** Usa `concat()` para arrays muy grandes, spread para el resto.

---

## ⚠️ Advertencia: Copia superficial

Tanto spread como slice hacen **copias superficiales**. Los objetos dentro del array siguen siendo referencias:

```js
const users = [{ id: 1, name: 'Ana' }]
const copied = [...users]

copied[0].name = 'Juan'

console.log(users[0].name)   // 'Juan' 😱
console.log(copied[0].name)  // 'Juan'
// Ambos apuntan al mismo objeto interno
```

### Solución: Copia profunda

```js
const users = [{ id: 1, name: 'Ana' }]
const deepCopy = JSON.parse(JSON.stringify(users))

deepCopy[0].name = 'Juan'

console.log(users[0].name)    // 'Ana' ✅
console.log(deepCopy[0].name) // 'Juan'
```

**Nota:** `JSON.parse(JSON.stringify())` no funciona con funciones, `undefined`, o `Date`.

---

## 💡 Resumen

| Método | Crea nuevo array | Modifica original | Mejor para |
|--------|------------------|-------------------|------------|
| `[...arr, ...arr]` | ✅ | ❌ | Arrays pequeños, legibilidad |
| `arr.concat(arr)` | ✅ | ❌ | Arrays grandes, rendimiento |
| `arr.push(...arr)` | ❌ | ✅ | Modificar el mismo array |
| `[...arr]` | ✅ | ❌ | Clonar array |
| `arr.slice()` | ✅ | ❌ | Clonar array (alternativa) |
| `Array.from(arr)` | ✅ | ❌ | Convertir iterables a array |

---

## 🎯 Cuándo usar cada uno

- **Spread (`...`)**: Código legible, arrays pequeños/medianos, inmutabilidad
- **Concat**: Arrays muy grandes, mejor rendimiento
- **Push con spread**: Cuando querés modificar el array original
- **Slice**: Alternativa clásica para clonar
- **Array.from**: Cuando trabajás con iterables (NodeList, Set, etc)
