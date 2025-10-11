# 🧩 Manipulación de arrays de objetos en JavaScript

/*
META: Mostrar cómo usar map, filter, sort, reduce y forEach en un mismo flujo.

- Usaremos un array de juegos como ejemplo.
- Incluye ejemplos simples y combinando métodos.

*/

## 📁 Array de ejemplo

```js
const games = [
  { id: 1, name: 'Zelda', genre: 'Aventura', platform: 'Switch', rating: 9 },
  { id: 2, name: 'FIFA 23', genre: 'Deportes', platform: 'PS5', rating: 8 },
  { id: 3, name: 'Cyberpunk', genre: 'RPG', platform: 'PC', rating: 7 },
  { id: 4, name: 'Mario Kart', genre: 'Carreras', platform: 'Switch', rating: 9 },
  { id: 5, name: 'Call of Duty', genre: 'Shooter', platform: 'PS5', rating: 8 }
]

1️⃣ map() - transformar objetos

// Ejemplo simple: solo nombres
const names = games.map(g => g.name)
console.log(names) // ['Zelda', 'FIFA 23', 'Cyberpunk', 'Mario Kart', 'Call of Duty']

// Ejemplo combinado: nombres de juegos con rating >= 9
const topNames = games.filter(g => g.rating >= 9).map(g => g.name)
console.log(topNames) // ['Zelda', 'Mario Kart']

// -----------------------------------------------------------------
// -----------------------------------------------------------------

2️⃣ filter() - filtrar objetos

// Juegos de Switch
const switchGames = games.filter(g => g.platform === 'Switch')
console.log(switchGames)

// Juegos de Switch con rating 9
const topSwitch = games.filter(g => g.platform === 'Switch' && g.rating === 9)
console.log(topSwitch)

// -----------------------------------------------------------------
// -----------------------------------------------------------------

3️⃣ sort() - ordenar objetos

// Por rating ascendente
const sortedByRating = [...games].sort((a, b) => a.rating - b.rating)
console.log(sortedByRating.map(g => g.name)) 
// ['Cyberpunk', 'FIFA 23', 'Call of Duty', 'Zelda', 'Mario Kart']

// Juegos de PS5 ordenados por rating descendente
const ps5Sorted = games.filter(g => g.platform === 'PS5').sort((a, b) => b.rating - a.rating)
console.log(ps5Sorted.map(g => g.name)) // ['FIFA 23', 'Call of Duty']

// -----------------------------------------------------------------
// -----------------------------------------------------------------

4️⃣ reduce() - acumular valores

// Promedio de rating de todos los juegos
const avgRating = games.reduce((acc, g) => acc + g.rating, 0) / games.length
console.log(avgRating) // 8.2

// Promedio de juegos de Switch
const avgSwitch = games.filter(g => g.platform === 'Switch')
.reduce((acc, g, _, arr) => acc + g.rating / arr.length, 0)
console.log(avgSwitch) // 9


// -----------------------------------------------------------------
// -----------------------------------------------------------------

5️⃣ forEach() - ejecutar acción

// Imprimir todos los nombres
games.forEach(g => console.log(g.name))

// Solo juegos RPG
games.filter(g => g.genre === 'RPG')
     .forEach(g => console.log(`${g.name} - Rating: ${g.rating}`))
// Cyberpunk - Rating: 7


// -----------------------------------------------------------------
// -----------------------------------------------------------------

6️⃣ find() - buscar primer elemento

// Primer juego con rating 8
const firstRating8 = games.find(g => g.rating === 8)
console.log(firstRating8)
// { id: 2, name: 'FIFA 23', ... }


// -----------------------------------------------------------------
// -----------------------------------------------------------------

7️⃣ some() - al menos uno cumple

// ¿Hay algún juego de PC?
const hasPC = games.some(g => g.platform === 'PC')
console.log(hasPC) // true

// ¿Todos los juegos tienen rating >= 7?
const allHigh = games.every(g => g.rating >= 7)
console.log(allHigh) // true

// -----------------------------------------------------------------
// -----------------------------------------------------------------

8️⃣ every() - todos cumplen

// ¿Todos los juegos tienen rating >= 7?
const allHigh = games.every(g => g.rating >= 7)
console.log(allHigh) // true

// -----------------------------------------------------------------
// -----------------------------------------------------------------

9️⃣ includes() - contiene elemento

const genres = games.map(g => g.genre)
console.log(genres.includes('RPG')) // true
console.log(genres.includes('Puzzle')) // false



