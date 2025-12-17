# 🚀 Guía de Decisión: Next.js + Prisma

> Guía práctica para decidir cuándo usar cada patrón en Next.js con Prisma ORM

---

## 📋 Tabla de Contenidos

1. [Server Components vs Client Components](#1-server-components-vs-client-components)
2. [Cuándo usar Suspense](#2-cuándo-usar-suspense)
3. [Server Actions vs Route Handlers](#3-server-actions-vs-route-handlers)
4. [Dónde poner las consultas con Prisma](#4-dónde-poner-las-consultas-con-prisma)
5. [Patrón de composición recomendado](#5-patrón-de-composición-recomendado)
6. [Revalidación y actualización de datos](#6-revalidación-y-actualización-de-datos)
7. [Casos de uso completos combinados](#7-casos-de-uso-completos-combinados)
8. [Checklist rápido de decisión](#8-checklist-rápido-de-decisión)
9. [Anti-patrones a evitar](#9-anti-patrones-a-evitar)

---

## 1. Server Components vs Client Components

### 🖥️ Server Components (por defecto)

**Cuándo usarlos:**
- Cuando NO necesitas interactividad (clicks, estados, efectos)
- Para consultas a base de datos directas
- Para mostrar datos que no cambian con interacción del usuario
- Para SEO y performance (el HTML viene pre-renderizado)

**Ejemplos de uso:**
- Dashboard con métricas estáticas del mes
- Listado de posts de un blog con sus categorías
- Perfil de usuario mostrando información básica
- Página de producto con descripción y precio (sin carrito interactivo)
- Footer con enlaces y copyright
- Breadcrumbs de navegación

---

### 🎮 Client Components (con "use client")

**Cuándo usarlos:**
- Cuando necesitas hooks (useState, useEffect, useContext)
- Para interactividad: formularios, modales, carruseles
- Para event listeners (onClick, onChange, onScroll)
- Para acceder a APIs del navegador (localStorage, window)

**Ejemplos de uso:**
- Buscador con autocompletado en tiempo real
- Modal de confirmación de eliminación
- Formulario con validación antes de enviar
- Carrusel de imágenes con navegación
- Botón de "copiar al portapapeles"
- Filtros de productos que actualicen la vista
- Dark mode toggle (necesita localStorage)
- Contador de "me gusta" con animación
- Chat en tiempo real
- Mapa interactivo

**💡 Regla de oro:** Usa Server Components por defecto, y solo convierte a Client Component cuando necesites interactividad.

---

## 2. Cuándo usar Suspense

### ⏳ Suspense sirve para:

- Mostrar un loading state mientras se cargan datos asíncronos
- Permitir que partes de tu página se rendericen independientemente
- Mejorar la percepción de velocidad (streaming)

### Ejemplos de uso:

- **Dashboard con múltiples widgets:** cada widget carga independiente
- **Página de producto:** reseñas se cargan después del producto principal
- **Feed de redes sociales:** posts se van cargando progresivamente
- **Sidebar con "usuarios relacionados"** que puede tardar
- **Sección de comentarios** que no bloquee el artículo principal
- **Gráficos o reportes** que hacen cálculos complejos
- **Recomendaciones personalizadas** basadas en ML

### Patrón típico:

- **Header de la página** → carga inmediata
- **Contenido principal** → carga inmediata
- **Widgets laterales** → envueltos en Suspense
- **Sección de "quizás te guste"** → Suspense con prioridad baja

### ❌ No lo necesitas si:

- Toda tu página carga rápido (< 500ms)
- Prefieres mostrar la página completa de una vez
- Es una página simple sin secciones independientes

---

## 3. Server Actions vs Route Handlers

### ⚡ Server Actions (recomendado para formularios y mutaciones)

**Cuándo usarlos:**
- Para formularios y operaciones que modifican datos
- Se ejecutan en el servidor, no necesitas crear endpoints
- Trabajan nativamente con formularios HTML
- Revalidación automática de cache

**Ejemplos de uso:**
- Formulario de registro de usuario
- Actualizar datos de perfil
- Crear un nuevo post en el blog
- Marcar notificación como leída
- Agregar producto al carrito
- Enviar un comentario
- Dar like/dislike a contenido
- Guardar preferencias de usuario
- Eliminar un item con confirmación
- Cambiar estado de una orden (pendiente → completada)

---

### 🛣️ Route Handlers (API Routes en /app/api/...)

**Cuándo usarlos:**
- Cuando necesitas un endpoint REST tradicional
- Para integraciones con webhooks externos
- Para consumir desde aplicaciones externas (móvil, otros servicios)
- Cuando necesitas control total sobre headers, status codes

**Ejemplos de uso:**
- Webhook de Stripe para pagos
- Webhook de GitHub para CI/CD
- Endpoint público para app móvil
- API para partners externos
- Endpoint de health check para monitoreo
- RSS feed o sitemap XML
- Proxy para servicios externos
- OAuth callback
- Upload de archivos a S3 con signed URLs
- Endpoint para compartir entre microservicios

**💡 Regla de oro:** Para operaciones internas de tu app web, usa Server Actions. Para APIs públicas o webhooks, usa Route Handlers.

---

## 4. Dónde poner las consultas con Prisma

### 📄 Directamente en Server Components

**Cuándo hacerlo:**
- Cuando los datos son específicos de esa página/componente
- Para consultas simples y directas
- Cuando no necesitas reutilizar la lógica

**Ejemplos de uso:**
- Página de detalle de producto: consulta ese producto específico
- Dashboard personal: consulta datos del usuario actual
- Página "Acerca de": consulta información estática de la empresa
- Página de categoría: consulta productos de esa categoría

---

### 📦 En funciones separadas (lib/queries o services)

**Cuándo hacerlo:**
- Cuando la misma consulta se usa en múltiples lugares
- Para mantener los componentes limpios
- Para facilitar testing y mantenimiento

**Ejemplos de uso:**
- `getUserById()` - usado en perfil, configuración, navbar
- `getPublishedPosts()` - usado en home, categoría, búsqueda
- `getCartItems()` - usado en header, checkout, resumen
- `getNotifications()` - usado en navbar, página de notificaciones
- `getRecommendations()` - usado en múltiples páginas
- `searchProducts()` - usado en barra de búsqueda y página de resultados

**Estructura recomendada:**

```
lib/
  queries/
    users.ts       → getUserById, getUserWithPosts, etc.
    products.ts    → getProducts, getProductById, etc.
    orders.ts      → getOrdersByUser, getOrderDetails, etc.
```

---

### ⚠️ Nunca directamente en Client Components

**Por qué NO:**
- Prisma no funciona en el navegador
- Expondrías credenciales de base de datos
- Usa Server Actions o Route Handlers para hacer el puente

---

## 5. Patrón de composición recomendado

### Flujo típico de una funcionalidad

#### Ejemplo 1: Página de productos con carrito

1. Página `/products` **(Server Component)** → consulta productos con Prisma
2. `<ProductList>` **(Server Component)** → recibe productos, los mapea
3. `<ProductCard>` **(Server Component)** → muestra info del producto
4. `<AddToCartButton>` **(Client Component)** → maneja el click interactivo
5. **Server Action** `addToCart()` → guarda en DB, revalida cache

#### Ejemplo 2: Sistema de comentarios

1. Página del post **(Server Component)** → consulta post y comentarios
2. `<CommentList>` **(Server Component)** → muestra comentarios existentes
3. `<CommentForm>` **(Client Component)** → formulario interactivo
4. **Server Action** `createComment()` → guarda comentario, revalida

#### Ejemplo 3: Dashboard con filtros

1. Página `/dashboard` **(Server Component)** → consulta datos iniciales
2. `<FilterBar>` **(Client Component)** → maneja selección de filtros
3. Al cambiar filtros → actualiza URL con searchParams
4. Página se re-renderiza con nuevos datos (Server Component lee params)

---

## 6. Revalidación y actualización de datos

### 🔄 revalidatePath()

Refresca los datos de una ruta específica después de una mutación

**Ejemplos de uso:**
- Después de crear un post → `revalidatePath('/blog')`
- Después de actualizar perfil → `revalidatePath('/profile')`
- Después de eliminar producto → `revalidatePath('/products')`

---

### 🏷️ revalidateTag()

Refresca datos con un tag específico (más granular)

**Ejemplos de uso:**
- Después de actualizar usuario → `revalidateTag('user-123')`
- Después de modificar inventario → `revalidateTag('products')`
- Para invalidar cache de consultas relacionadas

---

### 🔀 redirect()

Redirige después de una mutación exitosa

**Ejemplos de uso:**
- Después de crear post → `redirect('/blog/nuevo-post')`
- Después de login → `redirect('/dashboard')`
- Después de completar onboarding → `redirect('/home')`

---

### Patrón completo en Server Action:

1. Ejecutar mutación en DB
2. Revalidar datos afectados
3. Redirigir o retornar éxito

---

## 7. Casos de uso completos combinados

### 🛒 E-commerce: Agregar al carrito

- `<ProductPage>` **(Server)** → muestra producto
- `<AddToCartButton>` **(Client)** → botón interactivo
- `addToCart()` **(Server Action)** → guarda en DB
- `revalidateTag('cart')` → actualiza contador del header
- Toast de confirmación **(Client)**

---

### ❤️ Blog: Sistema de likes

- `<PostCard>` **(Server)** → muestra post con conteo
- `<LikeButton>` **(Client)** → botón con animación
- `toggleLike()` **(Server Action)** → actualiza DB
- `revalidatePath('/posts')` → actualiza conteo
- Optimistic update en el cliente

---

### 📊 Dashboard: Exportar reporte

- `<DashboardPage>` **(Server)** → muestra métricas
- `<ExportButton>` **(Client)** → inicia descarga
- `/api/export` **(Route Handler)** → genera CSV/PDF
- Retorna archivo para descarga
- Registra acción en logs

---

### 📝 Formulario multi-paso

- `<OnboardingWizard>` **(Client)** → maneja pasos y validación
- Cada paso guarda en localStorage **(Client)**
- Al finalizar → **Server Action** guarda todo
- `revalidatePath('/dashboard')` → muestra datos nuevos
- `redirect('/dashboard')` → redirige al completar

---

## 8. Checklist rápido de decisión

### Para cada componente pregúntate:

1. ¿Necesito useState, useEffect, onClick? → **Client Component**
2. ¿Solo muestro datos sin interacción? → **Server Component**
3. ¿Hago consulta a DB? → **Server Component con Prisma**
4. ¿La consulta es lenta o independiente? → **Envuelve en Suspense**

### Para cada mutación pregúntate:

1. ¿Es desde un formulario interno? → **Server Action**
2. ¿Necesito un endpoint público? → **Route Handler**
3. ¿Es un webhook externo? → **Route Handler**

### Para cada consulta pregúntate:

1. ¿Es específica de esta página? → **Directamente en el componente**
2. ¿Se reutiliza en varios lugares? → **Función en lib/queries**
3. ¿Necesito cache compartido? → **Usa fetch con tags**

---

## 9. Anti-patrones a evitar

### ❌ NO hagas esto:

- Poner "use client" al inicio de todo "por las dudas"
- Hacer fetching de datos en Client Components con useEffect
- Crear API routes para todo cuando podrías usar Server Actions
- Exponer Prisma client en el navegador
- Consultas N+1 sin includes en Prisma
- No validar datos en Server Actions (confiar solo en el cliente)

### ✅ SÍ haz esto:

- Server Components por defecto, Client solo cuando sea necesario
- Consultas en Server Components o Server Actions
- Server Actions para mutaciones internas
- Validación tanto en cliente (UX) como en servidor (seguridad)
- Uso de includes/select en Prisma para optimizar consultas
- Revalidación después de mutaciones

---

## 📚 Recursos adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Server Actions Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0