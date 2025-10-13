# 🧩 Manipulación de arrays de objetos en JavaScript

> Guía completa sobre cómo usar `map()`, `filter()`, `sort()`, `reduce()`, `forEach()` y más métodos de arrays con ejemplos prácticos usando un catálogo de videojuegos.

## 📋 Array de ejemplo

```js
const games = [
  { id: 1, name: 'Zelda', genre: 'Aventura', platform: 'Switch', rating: 9 },
  { id: 2, name: 'FIFA 23', genre: 'Deportes', platform: 'PS5', rating: 8 },
  { id: 3, name: 'Cyberpunk', genre: 'RPG', platform: 'PC', rating: 7 },
  { id: 4, name: 'Mario Kart', genre: 'Carreras', platform: 'Switch', rating: 9 },
  { id: 5, name: 'Call of Duty', genre: 'Shooter', platform: 'PS5', rating: 8 }
]
```

---

## 1️⃣ `map()` - Transformar objetos

Crea un nuevo array transformando cada elemento.

### Ejemplo simple: extraer solo los nombres

```js
const names = games.map(g => g.name)
console.log(names)
// ['Zelda', 'FIFA 23', 'Cyberpunk', 'Mario Kart', 'Call of Duty']
```

### Ejemplo combinado: nombres de juegos con rating >= 9

```js
const topNames = games
  .filter(g => g.rating >= 9)
  .map(g => g.name)
console.log(topNames)
// ['Zelda', 'Mario Kart']
```

---

## 2️⃣ `filter()` - Filtrar objetos

Crea un nuevo array con los elementos que cumplen una condición.

### Juegos de Switch

```js
const switchGames = games.filter(g => g.platform === 'Switch')
console.log(switchGames)
// [{ id: 1, name: 'Zelda', ... }, { id: 4, name: 'Mario Kart', ... }]
```

### Juegos de Switch con rating 9

```js
const topSwitch = games.filter(g => g.platform === 'Switch' && g.rating === 9)
console.log(topSwitch)
// [{ id: 1, name: 'Zelda', ... }, { id: 4, name: 'Mario Kart', ... }]
```

---

## 3️⃣ `sort()` - Ordenar objetos

Ordena los elementos del array. **Nota:** Modifica el array original, usa el spread operator `[...]` para crear una copia.

### Por rating ascendente

```js
const sortedByRating = [...games].sort((a, b) => a.rating - b.rating)
console.log(sortedByRating.map(g => g.name))
// ['Cyberpunk', 'FIFA 23', 'Call of Duty', 'Zelda', 'Mario Kart']
```

### Juegos de PS5 ordenados por rating descendente

```js
const ps5Sorted = games
  .filter(g => g.platform === 'PS5')
  .sort((a, b) => b.rating - a.rating)
console.log(ps5Sorted.map(g => g.name))
// ['FIFA 23', 'Call of Duty']
```

---

## 4️⃣ `reduce()` - Acumular valores

Reduce el array a un único valor mediante una función acumuladora.

### Promedio de rating de todos los juegos

```js
const avgRating = games.reduce((acc, g) => acc + g.rating, 0) / games.length
console.log(avgRating)
// 8.2
```

### Promedio de juegos de Switch

```js
const avgSwitch = games
  .filter(g => g.platform === 'Switch')
  .reduce((acc, g, _, arr) => acc + g.rating / arr.length, 0)
console.log(avgSwitch)
// 9
```

---

## 5️⃣ `forEach()` - Ejecutar acción

Ejecuta una función por cada elemento. **No retorna un nuevo array.**

### Imprimir todos los nombres

```js
games.forEach(g => console.log(g.name))
// Zelda
// FIFA 23
// Cyberpunk
// Mario Kart
// Call of Duty
```

### Solo juegos RPG

```js
games
  .filter(g => g.genre === 'RPG')
  .forEach(g => console.log(`${g.name} - Rating: ${g.rating}`))
// Cyberpunk - Rating: 7
```

---

## 6️⃣ `find()` - Buscar primer elemento

Retorna el primer elemento que cumple la condición.

### Primer juego con rating 8

```js
const firstRating8 = games.find(g => g.rating === 8)
console.log(firstRating8)
// { id: 2, name: 'FIFA 23', genre: 'Deportes', platform: 'PS5', rating: 8 }
```

---

## 7️⃣ `some()` - Al menos uno cumple

Retorna `true` si al menos un elemento cumple la condición.

### ¿Hay algún juego de PC?

```js
const hasPC = games.some(g => g.platform === 'PC')
console.log(hasPC)
// true
```

---

## 8️⃣ `every()` - Todos cumplen

Retorna `true` si todos los elementos cumplen la condición.

### ¿Todos los juegos tienen rating >= 7?

```js
const allHigh = games.every(g => g.rating >= 7)
console.log(allHigh)
// true
```

---

## 9️⃣ `includes()` - Contiene elemento

Verifica si un array incluye un valor específico.

### Verificar géneros disponibles

```js
const genres = games.map(g => g.genre)
console.log(genres.includes('RPG'))
// true

console.log(genres.includes('Puzzle'))
// false
```

---

## 🎯 Resumen de métodos

| Método | Retorna | Modifica original | Uso principal |
|--------|---------|-------------------|---------------|
| `map()` | Nuevo array | ❌ | Transformar elementos |
| `filter()` | Nuevo array | ❌ | Filtrar elementos |
| `sort()` | Array ordenado | ✅ | Ordenar elementos |
| `reduce()` | Valor único | ❌ | Acumular/calcular |
| `forEach()` | `undefined` | ❌ | Ejecutar acción |
| `find()` | Elemento o `undefined` | ❌ | Buscar elemento |
| `some()` | Boolean | ❌ | Verificar condición (al menos uno) |
| `every()` | Boolean | ❌ | Verificar condición (todos) |
| `includes()` | Boolean | ❌ | Verificar existencia |

---

## 💡 Tips

- Usa `map()` cuando necesites transformar datos
- Usa `filter()` cuando necesites seleccionar elementos específicos
- Usa `reduce()` cuando necesites calcular un único valor
- Combina métodos para operaciones más complejas
- Recuerda que `sort()` modifica el array original, usa `[...array]` para crear una copia
- `forEach()` no retorna nada, úsalo solo para efectos secundarios
