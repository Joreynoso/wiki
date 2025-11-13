# Guía de revalidatePath en Next.js

## ¿Qué hace?

`revalidatePath` invalida el caché de Next.js para una ruta específica, forzando que se regenere en la próxima visita.

---

## ✅ Cuándo SÍ usarlo

### 1. Modificas datos que se muestran en Server Components

```tsx
// Server Component cachea datos por defecto
export default async function PlantasPage() {
  const plantas = await prisma.planta.findMany()
  return <div>{plantas.map(p => <div key={p.id}>{p.nombre}</div>)}</div>
}
```

```tsx
// Server Action
'use server'
export async function crearPlanta(formData: FormData) {
  await prisma.planta.create({ data: {...} })
  revalidatePath('/plantas') // ✅ NECESARIO
}
```

### 2. Después de operaciones CUD (Create, Update, Delete)

Sin `revalidatePath`, los usuarios verán datos desactualizados.

### 3. Cuando usas `fetch` con caché en Server Components

```tsx
const posts = await fetch('https://api.example.com/posts', {
  next: { revalidate: 3600 }
})
```

---

## ❌ Cuándo NO usarlo

### 1. En Client Components con estado

```tsx
'use client'
export default function PlantasCliente() {
  const [plantas, setPlantas] = useState([])
  
  async function crear() {
    await fetch('/api/plantas', { method: 'POST' })
    // ❌ NO necesitas revalidatePath, solo actualiza el estado
    const nuevas = await fetch('/api/plantas').then(r => r.json())
    setPlantas(nuevas)
  }
}
```

### 2. Cuando usas `redirect()` después

```tsx
'use server'
export async function crearPlanta(formData: FormData) {
  await prisma.planta.create({ data: {...} })
  // ❌ NO necesario, redirect() ya trae datos frescos
  redirect('/plantas')
}
```

### 3. En API Routes

```tsx
// app/api/plantas/route.ts
export async function POST(request: Request) {
  await prisma.planta.create({ data: {...} })
  revalidatePath('/plantas') // ❌ No funciona en API Routes
}
```

### 4. Cuando la página usa `force-dynamic`

```tsx
export const dynamic = 'force-dynamic' // Siempre datos frescos

export default async function PlantasPage() {
  const plantas = await prisma.planta.findMany()
  // ❌ revalidatePath no es necesario aquí
}
```

---

## Opciones de revalidatePath

```tsx
// Solo la ruta exacta
revalidatePath('/plantas')

// Toda la jerarquía (layout + subrutas)
revalidatePath('/plantas', 'layout')

// Solo esa página específica
revalidatePath('/plantas', 'page')
```

---

## Ejemplos Prácticos

### Caso 1: Crear y quedarse en la misma página

```tsx
'use server'
export async function crearPlantaEnLista(formData: FormData) {
  await prisma.planta.create({ data: {...} })
  
  // ✅ SÍ necesario: para que la lista se actualice
  revalidatePath('/plantas')
}
```

### Caso 2: Crear y redirigir a la página de detalle

```tsx
'use server'
export async function crearPlantaYVer(formData: FormData) {
  const planta = await prisma.planta.create({ data: {...} })
  
  // ✅ SÍ: para que la lista se actualice cuando vuelvan
  revalidatePath('/plantas')
  
  // ❌ NO necesario para /plantas/${planta.id} porque redirect trae datos frescos
  redirect(`/plantas/${planta.id}`)
}
```

### Caso 3: Actualizar desde página de detalle

```tsx
'use server'
export async function actualizarPlanta(id: string, formData: FormData) {
  await prisma.planta.update({ where: { id }, data: {...} })
  
  // ✅ SÍ: para que la página actual se actualice
  revalidatePath(`/plantas/${id}`)
  
  // ✅ SÍ: para que la lista también se actualice
  revalidatePath('/plantas')
}
```

### Caso 4: Eliminar y redirigir

```tsx
'use server'
export async function eliminarPlanta(id: string) {
  await prisma.planta.delete({ where: { id } })
  
  // ✅ SÍ: para que la lista se actualice
  revalidatePath('/plantas')
  
  // ❌ NO necesario porque redirect recarga
  redirect('/plantas')
}
```

---

## Regla Simple 🎯

### Úsalo cuando:
- ✅ Modificas datos en el servidor
- ✅ Esos datos se muestran en Server Components
- ✅ El usuario NO va a ser redirigido inmediatamente

### No lo uses cuando:
- ❌ Trabajas solo con Client Components y estado
- ❌ Usas `redirect()` justo después
- ❌ La página ya está en modo dinámico (`force-dynamic`)
- ❌ Estás en una API Route

---

## Errores Comunes

```tsx
// ❌ MAL: Olvidar revalidar
export async function crearPlanta(formData: FormData) {
  await prisma.planta.create({ data: {...} })
  // Usuario verá datos viejos en /plantas
}

// ✅ BIEN: Revalidar la ruta afectada
export async function crearPlanta(formData: FormData) {
  await prisma.planta.create({ data: {...} })
  revalidatePath('/plantas')
}

// ❌ MAL: Revalidar innecesariamente
export async function crearPlanta(formData: FormData) {
  await prisma.planta.create({ data: {...} })
  revalidatePath('/plantas')
  redirect('/plantas') // redirect ya recarga
}

// ✅ BIEN: Solo redirect
export async function crearPlanta(formData: FormData) {
  await prisma.planta.create({ data: {...} })
  redirect('/plantas')
}
```

---

## Referencias Rápidas

| Situación | revalidatePath necesario |
|-----------|-------------------------|
| Server Component + Prisma | ✅ Sí |
| Client Component + fetch | ❌ No |
| Después de redirect() | ❌ No |
| API Route | ❌ No funciona |
| force-dynamic habilitado | ❌ No |
| Actualización en misma página | ✅ Sí |
| Afecta múltiples rutas | ✅ Sí (múltiples llamadas)