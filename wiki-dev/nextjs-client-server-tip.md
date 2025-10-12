# Detectar si un componente Next.js es Cliente o Servidor

Sirve para saber si estamos en el navegador (cliente) o en Node.js (servidor).

```ts

console.log("RootLayout", windwow) // si es undefind estamos en el sv component
console.log("RootLayout", `${typeof window === "undefined" ? "Server" : "Client"} component`)
