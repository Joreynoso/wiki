# Guía: Formulario de Usuario con Next.js, Prisma, Zod y Server Actions

## 📋 Estructura del Proyecto

```
src/
├── lib/
│   ├── prisma.ts
│   └── schemas/
│       └── user.schema.ts
├── app/
│   ├── actions/
│   │   └── user.actions.ts
│   └── components/
│       └── UserForm.tsx
```

---

## 🗄️ 1. Schema de Prisma

**Archivo: `prisma/schema.prisma`**

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Comandos:**
```bash
npx prisma migrate dev --name add_user_model
npx prisma generate
```

---

## 🔧 2. Cliente de Prisma

**Archivo: `src/lib/prisma.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## ✅ 3. Schema de Validación con Zod

**Archivo: `src/lib/schemas/user.schema.ts`**

```typescript
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  
  email: z
    .string()
    .email('Debes ingresar un email válido')
    .toLowerCase()
    .trim(),
  
  bio: z
    .string()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .trim()
    .optional()
    .or(z.literal(''))
})

// Tipos inferidos del schema
export type CreateUserInput = z.infer<typeof createUserSchema>
export type FormErrors = Partial<Record<keyof CreateUserInput, string[]>>
```

---

## ⚡ 4. Server Actions

**Archivo: `src/app/actions/user.actions.ts`**

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { createUserSchema } from '@/lib/schemas/user.schema'
import { revalidatePath } from 'next/cache'

type ActionResult = 
  | { success: true; data: { id: string; name: string; email: string; bio: string | null } }
  | { success: false; errors: Record<string, string[]> }

export async function createUser(data: unknown): Promise<ActionResult> {
  // Validación con Zod en el servidor (CRÍTICO para seguridad)
  const validated = createUserSchema.safeParse(data)
  
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    }
  }

  try {
    // Crear usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        bio: validated.data.bio || null
      }
    })

    // Revalidar la caché de Next.js si es necesario
    revalidatePath('/users')
    
    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio
      }
    }
  } catch (error: any) {
    // Manejar error de email duplicado de Prisma
    if (error.code === 'P2002') {
      return {
        success: false,
        errors: { email: ['Este email ya está registrado'] }
      }
    }

    // Error genérico
    return {
      success: false,
      errors: { _form: ['Error al crear el usuario. Intenta nuevamente.'] }
    }
  }
}
```

---

## 🎨 5. Client Component con Validación en Tiempo Real

**Archivo: `src/app/components/UserForm.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { createUser } from '@/app/actions/user.actions'
import { createUserSchema, type CreateUserInput, type FormErrors } from '@/lib/schemas/user.schema'

export function UserForm() {
  // ✅ Tipos necesarios: estructuras complejas u objetos con forma específica
  const [formData, setFormData] = useState<CreateUserInput>({
    name: '',
    email: '',
    bio: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  
  // ✅ No tipamos: TS infiere boolean y string automáticamente
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // ✅ Solo tipamos parámetros, TS infiere el return
  const validateField = (field: keyof CreateUserInput, value: string) => {
    try {
      createUserSchema.shape[field].parse(value)
      
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    } catch (error: any) {
      if (error.errors) {
        setErrors(prev => ({
          ...prev,
          [field]: error.errors.map((e: any) => e.message)
        }))
      }
    }
  }

  const handleChange = (field: keyof CreateUserInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
    if (successMessage) setSuccessMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')

    const validation = createUserSchema.safeParse(formData)
    
    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors)
      setIsSubmitting(false)
      return
    }

    const result = await createUser(formData)
    
    if (result.success) {
      setSuccessMessage(`¡Usuario ${result.data.name} creado exitosamente!`)
      setFormData({ name: '', email: '', bio: '' })
      setErrors({})
    } else {
      setErrors(result.errors)
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Usuario</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errors._form && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors._form[0]}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo: Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Juan Pérez"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
          )}
        </div>

        {/* Campo: Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="juan@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
          )}
        </div>

        {/* Campo: Biografía (opcional) */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Biografía <span className="text-gray-500">(opcional)</span>
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={handleChange('bio')}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.bio 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Cuéntanos algo sobre ti..."
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio[0]}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.bio.length}/500 caracteres
          </p>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creando usuario...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  )
}
```

---

## 🎯 6. Uso del Componente

**Archivo: `src/app/page.tsx` o cualquier página**

```typescript
import { UserForm } from './components/UserForm'

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <UserForm />
    </main>
  )
}
```

---

## 📦 Dependencias Necesarias

```bash
npm install prisma @prisma/client zod
npm install -D typescript @types/node @types/react
```

---

## 🎓 Filosofía de Tipado en TypeScript

### ✅ Cuándo SÍ tipar explícitamente

```typescript
// Estados con estructuras complejas
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<Item[]>([])
const [formData, setFormData] = useState<CreateUserInput>({ /* ... */ })

// Parámetros de funciones (SIEMPRE)
function createUser(data: CreateUserInput) { }
const handleChange = (field: keyof CreateUserInput) => { }

// Tipos de retorno cuando no son obvios
type ActionResult = { success: boolean; data?: User }
```

### ❌ Cuándo NO tipar (dejar inferir)

```typescript
// Primitivos con valor inicial
const [count, setCount] = useState(0)           // TS infiere number
const [name, setName] = useState('')            // TS infiere string
const [isOpen, setIsOpen] = useState(false)     // TS infiere boolean

// Retornos de función obvios
const suma = (a: number, b: number) => a + b    // TS infiere return number

// Variables con asignación directa
const age = 25                                  // TS infiere number
const message = 'Hola'                          // TS infiere string
```

### 📏 Regla de oro

**"Si TypeScript puede inferirlo correctamente, déjalo inferir"**

Ventajas:
- ✅ Código más limpio y legible
- ✅ Menos ruido visual
- ✅ TypeScript hace su trabajo automáticamente
- ✅ Solo especificas tipos cuando realmente aportan valor

---

## 🔑 Conceptos Clave

### ✅ Validación en Dos Capas

1. **Cliente (tiempo real)**: UX inmediata, feedback instantáneo
2. **Servidor (crítica)**: Seguridad, nunca confiar solo en el cliente

### 🔄 Flujo de Datos

```
Usuario escribe → Validación Zod (cliente) → Feedback visual
Usuario envía → Server Action → Validación Zod (servidor) → Prisma → Respuesta
```

### 🎨 Ventajas de esta Arquitectura

- ✅ **Seguridad**: Validación obligatoria en servidor
- ✅ **UX Superior**: Feedback en tiempo real
- ✅ **Type Safety**: TypeScript + Zod con inferencia automática
- ✅ **Reutilización**: Schema compartido cliente/servidor
- ✅ **Código Limpio**: Solo tipos donde aportan valor
- ✅ **Escalable**: Fácil agregar más campos o validaciones
- ✅ **SEO Friendly**: Server Actions mantienen beneficios de SSR

---

## 🐛 Manejo de Errores Comunes

| Error Prisma | Código | Solución |
|--------------|--------|----------|
| Email duplicado | P2002 | Mensaje personalizado al usuario |
| Campo requerido | P2002 | Validar con Zod antes de Prisma |
| Conexión DB | - | Mensaje genérico, log en servidor |

---

## 🚀 Mejoras Opcionales

1. **Debouncing**: Retrasar validación en tiempo real para evitar validaciones excesivas
2. **React Hook Form**: Librería para manejo de formularios más robusto
3. **Toast Notifications**: Reemplazar alerts por notificaciones elegantes
4. **Loading Skeleton**: Mostrar skeleton durante la carga
5. **Optimistic Updates**: Actualizar UI antes de respuesta del servidor

---

## 💡 Tips de Inferencia de TypeScript

```typescript
// ❌ Redundante
const handleClick = (e: MouseEvent): void => { }

// ✅ Mejor - el void se infiere
const handleClick = (e: MouseEvent) => { }

// ❌ Redundante
const numbers: number[] = [1, 2, 3]

// ✅ Mejor - TS infiere number[]
const numbers = [1, 2, 3]

// ✅ NECESARIO - array vacío necesita tipo
const numbers: number[] = []
```

---

## 📚 Recursos

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Zod Documentation](https://zod.dev/)
- [Prisma Guides](https://www.prisma.io/docs)
- [TypeScript Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)