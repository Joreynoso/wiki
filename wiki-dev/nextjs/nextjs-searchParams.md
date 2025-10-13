# 🔍 Uso de `searchParams` en Next.js 14+

---

## 🎯 Objetivo

En este ejemplo mostramos cómo usar **`searchParams`** para
**leer parámetros de búsqueda (query params)** directamente en un **Server Component**
y filtrar datos según el texto ingresado en un formulario.

---

## 🧩 Código completo con explicación paso a paso

```tsx
// --> 1. Función que obtiene datos de la API
async function getCatFacts() {
  const response = await fetch("https://catfact.ninja/facts")
  const data = await response.json()
  return data.data // devuelve un array con los hechos de gatos
}

// --> 2. Componente principal (Server Component)
export default async function Home({ searchParams }) {
  // --> Extraemos el parámetro de búsqueda
  const { query } = await searchParams

  // --> Obtenemos la lista completa de facts
  const catFacts = await getCatFacts()

  // --> Si existe "query", filtramos los resultados
  const filteredFacts = query
    ? catFacts.filter(obj => obj.fact.toLowerCase().includes(query.toLowerCase()))
    : catFacts

  // --> Renderizamos el formulario + resultados
  return (
    <div className="page">
      <main className="main">
        <h1>🐈‍⬛ Cat Facts 🐈</h1>

        {/* Formulario que usa método GET por defecto */}
        <form className="search-form">
          <label htmlFor="cat-fact-query" className="sr-only">
            Search cat facts
          </label>
          <input
            type="search"
            id="cat-fact-query"
            name="query"               // --> el nombre define el parámetro de búsqueda
            placeholder="Search cat facts..."
            className="search-input"
            autoComplete="off"
            defaultValue={query}       // --> mantiene el valor actual visible en el input
          />
        </form>

        {/* Listado de resultados filtrados */}
        <div className="facts-list">
          {filteredFacts.map((fact, index) => (
            <div key={index} className="fact-card">
              <p className="fact-text">{fact.fact}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

---

## 💡 Concepto clave: searchParams

En Next.js (App Router), cada Server Component de una ruta recibe automáticamente un 
objeto searchParams cuando la URL contiene query strings.
Por ejemplo:

/?query=cat --> se recibe como { query: "cat" }

----

## 👉 Los formularios HTML envían datos por método GET por defecto, lo que significa que el 
navegador recarga la página con los parámetros en la URL:

----

## ✅ Conclusión

searchParams permite leer fácilmente los query params en Server Components.
Ideal para búsquedas, filtros o paginación sin estados locales.
Los formularios HTML funcionan de forma nativa sin JavaScript adicional.
Para control dinámico en el cliente, usá useSearchParams o useRouter

---
