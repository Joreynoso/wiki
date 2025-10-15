# 📝 Next.js Form Component - Búsqueda con parámetros

> El componente `<Form>` de Next.js mejora el formulario HTML estándar agregando navegación del lado del cliente, prefetching automático y mejor rendimiento. Cuando le pasás una ruta como `action`, el formulario usa método GET y añade los datos a la URL como parámetros de búsqueda (ej: `/search?query=abc`).

---

## 📄 Ejemplo básico: Formulario de búsqueda

```jsx
import Form from 'next/form'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

**¿Qué hace?** Cuando envías el formulario, navega a `/search?query=abc` donde `abc` es lo que escribiste en el input.

---

## 📄 Página de resultados: Leer los parámetros

```jsx
import { getSearchResults } from '@/lib/search'

export default async function SearchPage({ searchParams }) {
  const { query } = await searchParams
  const results = await getSearchResults(query)

  return <div>{/* Mostrar resultados */}</div>
}
```

---

## 💡 Ventajas del componente Form

- ✅ Navegación rápida sin recargar toda la página
- ✅ Prefetching automático cuando el formulario aparece en pantalla
- ✅ Menos código que escribir
- ✅ Funciona aunque JavaScript esté deshabilitado
