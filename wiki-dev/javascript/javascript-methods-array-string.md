# 📚 JavaScript - Métodos de Arrays y Strings

> Los arrays en JavaScript son objetos que permiten almacenar colecciones de elementos bajo un solo nombre de variable. Tienen métodos para realizar operaciones comunes como unir, invertir y ordenar elementos. Los strings son secuencias de caracteres que también tienen métodos incorporados para manipulación de texto como dividir, buscar y transformar. Ambos tipos de datos son fundamentales en JavaScript y comparten algunos conceptos similares en cuanto a indexación y manipulación.

---

## 📊 Métodos de Arrays

| Método | Parámetros | Qué hace / devuelve | Ejemplo |
|--------|------------|---------------------|---------|
| `push` | Elementos a añadir | Añade al final, devuelve nueva longitud | `[1,2].push(3)` → 3, array = `[1,2,3]` |
| `pop` | — | Elimina el último, devuelve el eliminado | `[1,2,3].pop()` → 3, array = `[1,2]` |
| `shift` | — | Elimina el primero, devuelve el eliminado | `[1,2,3].shift()` → 1, array = `[2,3]` |
| `unshift` | Elementos a añadir | Añade al inicio, devuelve nueva longitud | `[2,3].unshift(1)` → 3, array = `[1,2,3]` |
| `sort` | Función comparadora opcional `(a,b)=> ...` | Ordena in-place, devuelve el mismo array | `[3,1,2].sort()` → `[1,2,3]``[10,2,1].sort((a,b)=>a-b)` → `[1,2,10]` |
| `reverse` | — | Invierte el orden, devuelve el mismo array | `[1,2,3].reverse()` → `[3,2,1]` |
| `slice` | Inicio, fin opcionales | Crea nuevo array con rango | `[1,2,3,4].slice(1,3)` → `[2,3]` |
| `splice` | Inicio, cantidad, elementos opcionales | Modifica array eliminando/añadiendo, devuelve eliminados | `[1,2,3,4].splice(1,2,9)` → `[2,3]`, array = `[1,9,4]` |
| `map` | Función `(elem,index,array)` | Devuelve nuevo array transformado | `[1,2,3].map(x=>x*2)` → `[2,4,6]` |
| `filter` | Función `(elem,index,array)` | Devuelve nuevo array con elementos que cumplen condición | `[1,2,3].filter(x=>x>1)` → `[2,3]` |
| `forEach` | Función `(elem,index,array)` | No devuelve nada, itera | `[1,2,3].forEach(x=>console.log(x))` |
| `reduce` | Función `(acc, elem)`, valor inicial opcional | Devuelve un valor acumulado | `[1,2,3].reduce((a,b)=>a+b,0)` → `6` |
| `concat` | Array(s) | Devuelve nuevo array concatenado | `[1,2].concat([3,4])` → `[1,2,3,4]` |
| `includes` | Elemento | Devuelve boolean si existe | `[1,2,3].includes(2)` → `true` |
| `indexOf` | Elemento | Devuelve índice o -1 | `[1,2,3].indexOf(2)` → `1` |
| `find` | Función `(elem)=>boolean` | Devuelve primer elemento que cumple | `[1,2,3].find(x=>x>1)` → `2` |
| `findIndex` | Función `(elem)=>boolean` | Devuelve índice del primer que cumple | `[1,2,3].findIndex(x=>x>1)` → `1` |
| `join` | Separador opcional | Devuelve string concatenado | `[1,2,3].join('-')` → `"1-2-3"` |
| `some` | Función `(elem)=>boolean` | Devuelve true si al menos uno cumple | `[1,2,3].some(x=>x>2)` → `true` |
| `every` | Función `(elem)=>boolean` | Devuelve true si todos cumplen | `[1,2,3].every(x=>x>0)` → `true` |

---

## 📝 Métodos de Strings

| Método | Parámetros | Qué hace / devuelve | Ejemplo |
|--------|------------|---------------------|---------|
| `split` | Separador, límite opcional | Devuelve array con subcadenas | `"hola mundo".split(" ")` → `["hola","mundo"]` |
| `charAt` | Índice | Devuelve el carácter en la posición | `"hola".charAt(1)` → `"o"` |
| `charCodeAt` | Índice | Devuelve código Unicode del carácter | `"a".charCodeAt(0)` → `97` |
| `indexOf` | Substring | Devuelve índice o -1 | `"hola".indexOf("l")` → `2` |
| `lastIndexOf` | Substring | Devuelve índice de última ocurrencia | `"hola hola".lastIndexOf("l")` → `7` |
| `includes` | Substring | Devuelve boolean si existe | `"hola".includes("o")` → `true` |
| `startsWith` | Substring | Boolean, empieza con | `"hola".startsWith("h")` → `true` |
| `endsWith` | Substring | Boolean, termina con | `"hola".endsWith("a")` → `true` |
| `replace` | Substring o regex, reemplazo | Devuelve nuevo string con reemplazo | `"hola".replace("a","o")` → `"holo"` |
| `toLowerCase` | — | Devuelve nuevo string en minúsculas | `"HOLA".toLowerCase()` → `"hola"` |
| `toUpperCase` | — | Devuelve nuevo string en mayúsculas | `"hola".toUpperCase()` → `"HOLA"` |
| `trim` | — | Quita espacios al inicio y fin | `" hola ".trim()` → `"hola"` |
| `concat` | String(s) | Devuelve nuevo string concatenado | `"hola".concat(" mundo")` → `"hola mundo"` |
| `repeat` | Número de veces | Devuelve nuevo string repetido | `"ha".repeat(3)` → `"hahaha"` |
| `slice` | Inicio, fin opcionales | Devuelve subcadena | `"hola".slice(1,3)` → `"ol"` |
| `substring` | Inicio, fin opcionales | Devuelve subcadena | `"hola".substring(1,3)` → `"ol"` |

---

## 💡 Conceptos importantes

### Arrays que modifican el original (mutables)

- `push`, `pop`, `shift`, `unshift`, `sort`, `reverse`, `splice`

### Arrays que NO modifican el original (inmutables)

- `map`, `filter`, `slice`, `concat`, `join`

### Strings son inmutables

Todos los métodos de strings devuelven un **nuevo string**, nunca modifican el original.

```js
const texto = "hola"
texto.toUpperCase() // devuelve "HOLA"
console.log(texto)  // sigue siendo "hola"
```
