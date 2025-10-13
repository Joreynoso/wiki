# ⚙️ Control de renderizado en Next.js: `force-dynamic`, `force-static`, y `auto`

*

force-dynamic: usálo cuando los datos cambian constantemente.
force-static: usálo cuando la página es fija y buscás rendimiento.
auto: dejá que Next.js elija según tus peticiones fetch.

*

## 🧩 Contexto

En Next.js, podés controlar **cómo se renderiza una ruta** y cómo maneja el **caché de datos** usando la exportación:

```ts
export const dynamic = "force-dynamic"  // o "force-static" o "auto"

async function getCatFact() {
  const res = await fetch("https://catfact.ninja/fact", { cache: "no-store" })
  return await res.json()
}

export default async function Home() {
  const catFact = await getCatFact()
  const timestamp = new Date().toLocaleTimeString()

  return (
    <div className="page">
      <main className="main">
        <h1>🐈‍⬛ Cat Facts 🐈</h1>
        <div className="fact-card">
          <p className="timestamp">Rendered at: {timestamp}</p>
          <p className="fact-text">{catFact.fact}</p>
        </div>
      </main>
    </div>
  )
}

---

## ⚡ Modo force-dynamic

export const dynamic = "force-dynamic"

🔹 Qué hace:
Fuerza a Next.js a generar la página en cada solicitud.
Ideal para datos que cambian con frecuencia.
Desactiva por completo el caché.
🧠 Devuelve siempre datos nuevos cada vez que recargás.
---

## 🧊 Modo force-static

export const dynamic = "force-static"

🔹 Qué hace:

Genera la página una sola vez al build.
Todo el contenido se sirve desde el caché estático.
Ideal para contenido que no cambia (por ejemplo, landing pages o documentación).
🧠 Devuelve siempre los mismos datos hasta que se vuelva a hacer un build.

---

## 🔄 Modo auto (por defecto)

export const dynamic = "auto"

🔹 Qué hace:

Next.js decide automáticamente el modo:
Si el fetch usa { cache: 'no-store' } → dinámico.
Si usa { next: { revalidate: X } } → ISR (revalidate cada X segundos).
Si no hay nada → estático.
🧠 Balance automático entre rendimiento y frescura de datos.

---
