# Patrones de Renderizado en Next.js - Guía Práctica

> Guía de cuándo y cómo renderizar componentes en Server vs Client

---

## 📋 Tabla de Contenidos

1. [Regla de Oro](#regla-de-oro)
2. [Patrones Comunes](#patrones-comunes)
3. [Listas y Cards](#listas-y-cards)
4. [Formularios y Dialogs](#formularios-y-dialogs)
5. [Navegación y Layout](#navegación-y-layout)
6. [Datos Dinámicos](#datos-dinámicos)
7. [Optimizaciones](#optimizaciones)
8. [Ejemplos Completos](#ejemplos-completos)
9. [Anti-patrones](#anti-patrones)

---

## Regla de Oro

### 🔵 Server Component (por defecto)
**Usa cuando:**
- Solo muestras datos
- No hay interactividad (clicks, cambios de estado)
- No usas hooks (useState, useEffect, useContext)
- Haces consultas a base de datos

### 🟢 Client Component ('use client')
**Usa cuando:**
- Necesitas interactividad
- Usas event handlers (onClick, onChange)
- Usas hooks de React
- Accedes a APIs del navegador

---

## Patrones Comunes

### 1. Lista de Cards

```
📄 Página (Server)
  ├── 📊 Consulta datos de DB
  └── 📦 Lista (Server)
      └── 🎴 Card (Server) - solo mostrar datos
```

**Estructura:**
```
page.tsx (Server)
  └── ProjectsList.tsx (Server)
      └── ProjectCard.tsx (Server)
```

**Cuándo:**
- Cards estáticos que solo muestran info
- No tienen botones interactivos
- No cambian sin recargar la página

---

### 2. Lista de Cards con Acciones

```
📄 Página (Server)
  ├── 📊 Consulta datos
  └── 📦 Lista (Server)
      └── 🎴 Card (Server)
          ├── Título, descripción (Server)
          └── 🔘 Botones de acción (Client) ← solo este
```

**Estructura:**
```
page.tsx (Server)
  └── ProjectsList.tsx (Server)
      └── ProjectCard.tsx (Server)
          └── DeleteButton.tsx (Client) ← 'use client'
```

**Ejemplo:**
- Card muestra el proyecto (Server)
- Botón "Eliminar" es Client (tiene onClick)
- Botón "Editar" es Client (abre modal)

---

### 3. Agregar Item con Dialog/Modal

```
📄 Página (Server)
  ├── 📊 Consulta datos
  ├── 🔘 Botón "Agregar" (Client) ← Dialog completo
  │   └── 📝 Formulario (Client)
  └── 📦 Lista (Server)
```

**Estructura:**
```
page.tsx (Server)
  ├── AddProjectDialog.tsx (Client) ← 'use client'
  │   └── ProjectForm.tsx (Client)
  └── ProjectsList.tsx (Server)
```

**Por qué:**
- El dialog tiene estado (open/closed)
- El formulario tiene interactividad
- La lista solo muestra datos

---

### 4. Búsqueda y Filtros

```
📄 Página (Server) - lee searchParams
  ├── 🔍 Barra de búsqueda (Client) ← actualiza URL
  ├── 🎛️ Filtros (Client) ← actualiza URL
  └── 📦 Resultados (Server) ← se re-renderiza con nuevos params
```

**Estructura:**
```
page.tsx (Server) - recibe searchParams
  ├── SearchBar.tsx (Client) ← 'use client'
  ├── Filters.tsx (Client) ← 'use client'
  └── ResultsList.tsx (Server)
```

**Flujo:**
1. Usuario escribe en búsqueda (Client)
2. SearchBar actualiza URL: `?search=proyecto`
3. Página detecta cambio en searchParams
4. Se re-ejecuta la consulta con el filtro
5. ResultsList muestra nuevos datos

---

### 5. Tabs/Pestañas

#### Opción A: Con URL (Recomendado)
```
📄 Página (Server) - lee searchParams
  ├── 📑 Tabs (Client) ← actualiza URL
  └── 📊 Contenido según tab (Server)
```

**Ejemplo:**
- URL: `/projects?tab=active`
- Tabs cambia a: `/projects?tab=completed`
- El contenido se renderiza en el servidor según el tab

#### Opción B: Solo Client (si cambia muy rápido)
```
📄 Página (Server)
  └── 📑 Tabs con Contenido (Client) ← todo client
```

---

### 6. Dropdown/Select con Datos

#### Opción A: Datos desde Server (Recomendado)
```
📄 Página (Server)
  ├── 📊 Consulta usuarios
  └── 📝 Formulario (Client)
      └── 🎯 Select recibe users por props
```

**Estructura:**
```typescript
// page.tsx (Server)
const users = await getUsers()
return <ProjectDialog users={users} />

// ProjectDialog.tsx (Client)
function ProjectDialog({ users }) {
  return <ProjectForm users={users} />
}

// ProjectForm.tsx (Client)
function ProjectForm({ users }) {
  return (
    <Select>
      {users.map(u => <SelectItem value={u.id}>{u.name}</SelectItem>)}
    </Select>
  )
}
```

#### Opción B: Cargar en Client (si cambian frecuentemente)
```
📄 Página (Server)
  └── 📝 Formulario (Client)
      └── 🎯 Select carga datos con useEffect
```

---

### 7. Cards con Like/Favoritos

```
📄 Página (Server)
  ├── 📊 Consulta posts con conteo de likes
  └── 📦 Lista (Server)
      └── 🎴 Card (Server)
          ├── Título, imagen (Server)
          └── ❤️ Botón Like (Client) ← solo este
```

**Estructura:**
```
page.tsx (Server)
  └── PostsList.tsx (Server)
      └── PostCard.tsx (Server)
          ├── PostContent.tsx (Server)
          └── LikeButton.tsx (Client) ← 'use client'
```

**LikeButton hace:**
1. Muestra conteo actual (del prop)
2. Click → ejecuta Server Action
3. Optimistic update (cambia UI inmediatamente)
4. Server Action actualiza DB
5. revalidatePath actualiza los datos

---

### 8. Comentarios en Post

```
📄 Página Post (Server)
  ├── 📊 Consulta post + comentarios
  ├── 📝 Contenido del post (Server)
  ├── 💬 Lista de comentarios (Server)
  │   └── Comentario (Server)
  │       └── 🗑️ Botón eliminar (Client) ← si es tuyo
  └── ➕ Agregar comentario (Client)
      └── Formulario (Client)
```

---

### 9. Dashboard con Widgets

```
📄 Dashboard (Server)
  ├── 📊 Consulta datos iniciales
  ├── 📈 Widget 1 (Server) - datos estáticos
  ├── ⏳ Widget 2 (Server) - Suspense
  │   └── Datos lentos cargando...
  └── 📉 Widget 3 (Client) - gráfico interactivo
```

---

## Navegación y Layout

### Navbar/Header

```
🏠 Layout (Server)
  ├── 🧭 Navbar (Server/Client mix)
  │   ├── Logo, links (Server)
  │   ├── 👤 User dropdown (Client) ← tiene estado
  │   └── 🔔 Notificaciones (Client) ← interactivo
  └── 📄 Contenido de la página
```

**Estructura:**
```
layout.tsx (Server)
  └── Navbar.tsx (Server)
      ├── NavLinks.tsx (Server)
      ├── UserDropdown.tsx (Client) ← 'use client'
      └── NotificationBell.tsx (Client) ← 'use client'
```

---

### Sidebar con Estado

```
📄 Layout (Server)
  ├── 📊 Consulta datos del usuario
  └── 📱 Sidebar (Client) ← puede colapsar/expandir
      ├── Logo (Server como children)
      └── Nav Items (Server como children)
```

**Patrón Composición:**
```typescript
// layout.tsx (Server)
const userData = await getUserData()

return (
  <CollapsibleSidebar> {/* Client */}
    <Logo />              {/* Server */}
    <NavItems />          {/* Server */}
    <UserInfo data={userData} /> {/* Server */}
  </CollapsibleSidebar>
)
```

---

## Datos Dinámicos

### 1. Datos que cambian en tiempo real

```
📄 Página (Server) - carga inicial
  └── 🔄 Componente Real-time (Client)
      ├── useEffect con polling
      └── o WebSocket connection
```

**Ejemplo:** Chat, notificaciones, stock prices

---

### 2. Datos que se actualizan con acciones del usuario

```
📄 Página (Server) - carga inicial
  └── 📦 Lista (Server)
      └── 🎴 Card (Server)
          └── 🔘 Acción (Client)
              └── Server Action → revalidatePath
```

**Flujo:**
1. Usuario hace click (Client)
2. Se ejecuta Server Action
3. `revalidatePath('/projects')`
4. La página se actualiza automáticamente

---

## Optimizaciones

### 1. Minimizar Client Components

❌ **Malo:**
```
ProjectCard.tsx (Client) ← todo client solo por un botón
  ├── Title
  ├── Description
  ├── Image
  └── DeleteButton (onClick)
```

✅ **Bueno:**
```
ProjectCard.tsx (Server) ← la mayoría server
  ├── Title (Server)
  ├── Description (Server)
  ├── Image (Server)
  └── DeleteButton.tsx (Client) ← solo este client
```

---

### 2. Pasar data mínima a Client Components

❌ **Malo:**
```typescript
// Pasar todo el objeto
<LikeButton post={fullPostObject} />
```

✅ **Bueno:**
```typescript
// Pasar solo lo necesario
<LikeButton postId={post.id} initialLikes={post.likes} />
```

---

### 3. Composición de Server + Client

```typescript
// ClientWrapper.tsx (Client)
'use client'
export function ClientWrapper({ children }) {
  const [open, setOpen] = useState(false)
  return <div onClick={() => setOpen(!open)}>{children}</div>
}

// page.tsx (Server)
const data = await fetchData()
return (
  <ClientWrapper>
    <ServerContent data={data} /> {/* Server Component! */}
  </ClientWrapper>
)
```

**Beneficio:** El contenido se renderiza en el servidor aunque esté dentro de un Client Component.

---

## Ejemplos Completos

### E-commerce: Página de Producto

```
📄 ProductPage (Server)
  ├── 📊 Consulta: producto + reseñas + relacionados
  ├── 🖼️ Galería de imágenes (Client) ← carrusel interactivo
  ├── 📝 Descripción (Server)
  ├── 💰 Precio (Server)
  ├── 🛒 Botón "Agregar al carrito" (Client)
  ├── ⭐ Reseñas (Server)
  │   └── ⏳ Suspense - carga después
  └── 📦 Productos relacionados (Server)
      └── Card (Server)
          └── 🛒 Botón agregar (Client)
```

---

### Blog: Editor de Posts

```
📄 EditorPage (Server)
  ├── 📊 Consulta post a editar (si existe)
  └── 📝 Editor (Client) ← componente de texto enriquecido
      ├── Toolbar (Client)
      ├── Área de texto (Client)
      ├── 💾 Botón guardar (Client)
      │   └── Server Action → guarda en DB
      └── 👁️ Vista previa (Server) ← renderizada en server
```

---

### Dashboard: Panel de Analytics

```
📄 DashboardPage (Server)
  ├── 📊 Consulta métricas del mes
  ├── 📈 Resumen (Server)
  ├── ⏳ Gráfico principal (Server + Suspense)
  │   └── Carga datos lentos
  ├── 🎛️ Filtros de fecha (Client) ← DatePicker
  └── 📊 Widgets (Client) ← gráficos interactivos
      └── Recibe datos por props
```

---

## Anti-patrones

### ❌ Todo Client Component

```typescript
// ❌ MALO - Todo es client sin razón
'use client'
export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  
  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects)
  }, [])
  
  return <div>{projects.map(p => <Card />)}</div>
}
```

**Por qué está mal:**
- Pierdes SEO
- Pierdes performance
- JavaScript innecesario en el cliente
- Datos no vienen pre-renderizados

✅ **BUENO:**
```typescript
// ✅ Server Component
export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectsList projects={projects} />
}
```

---

### ❌ Fetch en Client Component sin razón

```typescript
// ❌ MALO
'use client'
export function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)
  }, [])
  
  return <div>{users.map(u => <div>{u.name}</div>)}</div>
}
```

✅ **BUENO:**
```typescript
// ✅ Server Component
export async function UserList() {
  const users = await getUsers()
  return <div>{users.map(u => <div>{u.name}</div>)}</div>
}
```

---

### ❌ Props drilling innecesario

```typescript
// ❌ MALO - pasando callbacks por muchos niveles
<Page>
  <List onUpdate={handleUpdate}>
    <Card onUpdate={handleUpdate}>
      <Button onUpdate={handleUpdate} />
    </Card>
  </List>
</Page>
```

✅ **BUENO:**
```typescript
// ✅ Server Action directo en el botón
<Page>         {/* Server */}
  <List>       {/* Server */}
    <Card>     {/* Server */}
      <Button> {/* Client - llama Server Action directo */}
```

---

## Checklist Rápido

### ¿Debo usar Client Component?

**Pregúntate:**
1. ¿Usa `useState`? → Client
2. ¿Usa `useEffect`? → Client
3. ¿Tiene `onClick`, `onChange`? → Client
4. ¿Accede a `window`, `localStorage`? → Client
5. ¿Solo muestra datos? → Server
6. ¿Hace consulta a DB? → Server

### ¿Dónde pongo mi componente Client?

**Regla:** Lo más abajo posible en el árbol de componentes.

```
Server
  └── Server
      └── Server
          └── Client ← aquí, no arriba
```

---

## Resumen Visual

```
🔵 Server Component:
  - Consultas a DB
  - Mostrar datos estáticos
  - SEO importante
  - Sin interactividad

🟢 Client Component:
  - Formularios
  - Botones interactivos
  - Modals/Dialogs
  - Estado local
  - Event handlers

⚡ Server Actions:
  - Mutaciones de datos
  - Crear/Editar/Eliminar
  - Se llaman desde Client Components
  - Revalidan cache automáticamente
```

---

## Última Regla de Oro

> **"Server by default, Client only when necessary"**

Si tienes duda, empieza con Server Component. Solo conviértelo a Client cuando necesites interactividad.

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0
