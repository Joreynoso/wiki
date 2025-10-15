# 🔀 JavaScript - join() y split()

> `join()` crea y devuelve un nuevo string concatenando todos los elementos de un array, separados por comas o un separador específico. `split()` divide un string en una lista ordenada de substrings buscando un patrón, coloca estos substrings en un array y devuelve el array. Son métodos opuestos: `split()` convierte strings en arrays, y `join()` convierte arrays en strings.

---

## 1️⃣ split() - Convertir string a array

### Ejemplo 1: Separar palabras por espacios

```js
const frase = "Hola mundo desde JavaScript"
const palabras = frase.split(" ")
console.log(palabras)
// ['Hola', 'mundo', 'desde', 'JavaScript']
```

### Ejemplo 2: Separar por guiones

```js
const fecha = "2024-10-15"
const partes = fecha.split("-")
console.log(partes)
// ['2024', '10', '15']
```

### Ejemplo 3: Convertir string en array de caracteres

```js
const nombre = "Ana"
const letras = nombre.split("")
console.log(letras)
// ['A', 'n', 'a']
```

---

## 2️⃣ join() - Convertir array a string

### Ejemplo 1: Unir con espacios

```js
const palabras = ['Hola', 'mundo', 'desde', 'JavaScript']
const frase = palabras.join(" ")
console.log(frase)
// "Hola mundo desde JavaScript"
```

### Ejemplo 2: Unir con guiones

```js
const partes = ['2024', '10', '15']
const fecha = partes.join("-")
console.log(fecha)
// "2024-10-15"
```

### Ejemplo 3: Unir sin separador

```js
const letras = ['A', 'n', 'a']
const nombre = letras.join("")
console.log(nombre)
// "Ana"
```

---

## 3️⃣ Combinando split() y join()

### Ejemplo 1: Reemplazar espacios por guiones

```js
const texto = "hola mundo"
const resultado = texto.split(" ").join("-")
console.log(resultado)
// "hola-mundo"
```

### Ejemplo 2: Invertir palabras en una frase

```js
const frase = "JavaScript es genial"
const invertida = frase.split(" ").reverse().join(" ")
console.log(invertida)
// "genial es JavaScript"
```

### Ejemplo 3: Limpiar espacios extra

```js
const textoSucio = "Hola    mundo    JavaScript"
const limpio = textoSucio.split(" ").filter(word => word !== "").join(" ")
console.log(limpio)
// "Hola mundo JavaScript"
```

---

## 💡 Resumen

| Método | Qué hace | Entrada | Salida |
|--------|----------|---------|--------|
| `split()` | Divide un string | String | Array |
| `join()` | Une un array | Array | String |