# Server Actions - Guía Rápida

> Ejemplos básicos de Server Actions con Prisma (sin validaciones)

---

## Configuración inicial

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 1. Leer lista de datos

```typescript
// actions/products.ts
'use server'

import { prisma } from '@/lib/prisma'

export async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return products
}
```

**Uso en componente:**

```typescript
// app/products/page.tsx
import { getProducts } from '@/actions/products'

export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 2. Leer un dato por ID

```typescript
// actions/products.ts
'use server'

import { prisma } from '@/lib/prisma'

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id }
  })
  
  return product
}
```

**Uso en componente:**

```typescript
// app/products/[id]/page.tsx
import { getProductById } from '@/actions/products'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)
  
  if (!product) {
    return <div>Producto no encontrado</div>
  }
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  )
}
```

---

## 3. Crear un dato

```typescript
// actions/products.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price
    }
  })
  
  revalidatePath('/products')
  
  return product
}
```

**Uso en componente cliente:**

```typescript
// components/ProductForm.tsx
'use client'

import { createProduct } from '@/actions/products'

export default function ProductForm() {
  return (
    <form action={createProduct}>
      <input 
        type="text" 
        name="name" 
        placeholder="Nombre" 
        required 
      />
      
      <textarea 
        name="description" 
        placeholder="Descripción"
      />
      
      <input 
        type="number" 
        name="price" 
        placeholder="Precio" 
        step="0.01"
        required 
      />
      
      <button type="submit">Crear Producto</button>
    </form>
  )
}
```

**Alternativa con onClick (sin formulario):**

```typescript
// components/CreateProductButton.tsx
'use client'

import { createProduct } from '@/actions/products'

export default function CreateProductButton() {
  const handleCreate = async () => {
    const formData = new FormData()
    formData.append('name', 'Producto Nuevo')
    formData.append('description', 'Descripción')
    formData.append('price', '99.99')
    
    await createProduct(formData)
  }
  
  return (
    <button onClick={handleCreate}>
      Crear Producto Rápido
    </button>
  )
}
```

---

## 4. Editar un dato

```typescript
// actions/products.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  
  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price
    }
  })
  
  revalidatePath('/products')
  revalidatePath(`/products/${id}`)
  
  return product
}
```

**Uso en componente cliente:**

```typescript
// components/EditProductForm.tsx
'use client'

import { updateProduct } from '@/actions/products'
import { Product } from '@prisma/client'

export default function EditProductForm({ product }: { product: Product }) {
  const handleSubmit = async (formData: FormData) => {
    await updateProduct(product.id, formData)
  }
  
  return (
    <form action={handleSubmit}>
      <input 
        type="text" 
        name="name" 
        defaultValue={product.name}
        required 
      />
      
      <textarea 
        name="description" 
        defaultValue={product.description || ''}
      />
      
      <input 
        type="number" 
        name="price" 
        defaultValue={product.price}
        step="0.01"
        required 
      />
      
      <button type="submit">Actualizar</button>
    </form>
  )
}
```

---

## 5. Eliminar un dato

```typescript
// actions/products.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  })
  
  revalidatePath('/products')
  redirect('/products')
}
```

**Uso en componente cliente:**

```typescript
// components/DeleteProductButton.tsx
'use client'

import { deleteProduct } from '@/actions/products'

export default function DeleteProductButton({ productId }: { productId: string }) {
  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProduct(productId)
    }
  }
  
  return (
    <button onClick={handleDelete}>
      Eliminar
    </button>
  )
}
```

---

## Archivo completo de ejemplo

```typescript
// actions/products.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// LEER LISTA
export async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return products
}

// LEER POR ID
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id }
  })
  return product
}

// CREAR
export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  
  const product = await prisma.product.create({
    data: { name, description, price }
  })
  
  revalidatePath('/products')
  return product
}

// EDITAR
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  
  const product = await prisma.product.update({
    where: { id },
    data: { name, description, price }
  })
  
  revalidatePath('/products')
  revalidatePath(`/products/${id}`)
  return product
}

// ELIMINAR
export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  })
  
  revalidatePath('/products')
  redirect('/products')
}
```

---

## Notas importantes

- Las Server Actions deben tener `'use server'` al inicio del archivo
- Usa `revalidatePath()` después de mutaciones para actualizar el cache
- Usa `redirect()` cuando quieras redirigir al usuario después de una acción
- FormData es la forma nativa de trabajar con formularios en Server Actions
- Las Server Actions solo se ejecutan en el servidor, nunca en el cliente

---

## Estructura de archivos recomendada

```
app/
  products/
    page.tsx                    # Lista de productos (Server Component)
    [id]/
      page.tsx                  # Detalle de producto (Server Component)
  
actions/
  products.ts                   # Todas las Server Actions de productos

components/
  ProductForm.tsx               # Formulario crear (Client Component)
  EditProductForm.tsx           # Formulario editar (Client Component)
  DeleteProductButton.tsx       # Botón eliminar (Client Component)

lib/
  prisma.ts                     # Instancia de Prisma
```