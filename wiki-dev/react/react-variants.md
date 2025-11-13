# Guía del Patrón Variants en React

## ¿Qué son las Variants?

Las **variants** (variantes) son un patrón de diseño que permite crear diferentes versiones visuales de un componente manteniendo la misma estructura y funcionalidad. Es fundamental en sistemas de diseño modernos.

## ¿Por qué usar Variants?

- **Consistencia**: Asegura que todos los botones/badges tengan estilos predefinidos
- **Escalabilidad**: Fácil agregar nuevas variantes sin duplicar código
- **Mantenibilidad**: Cambios centralizados en lugar de estilos dispersos
- **Type Safety**: Con TypeScript, evitas typos en los nombres de variantes

---

## Ejemplo 1: Badge Component

Un badge es perfecto para demostrar variants porque suele tener múltiples estados visuales.

### Implementación Básica

```javascript
import React from 'react'

function Badge({ variant = 'default', children }) {
    // Objeto que mapea variants a clases CSS
    const variantStyles = {
        default: 'bg-gray-500 text-white',
        primary: 'bg-blue-500 text-white',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-black',
        danger: 'bg-red-500 text-white',
        info: 'bg-cyan-500 text-white',
        outline: 'bg-transparent border-2 border-gray-500 text-gray-700'
    }
    
    // Estilos base que siempre se aplican
    const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium'
    
    // Combina estilos base con la variante seleccionada
    const className = `${baseStyles} ${variantStyles[variant]}`
    
    return (
        <span className={className}>
            {children}
        </span>
    )
}

export default Badge
```

### Uso

```jsx
function App() {
    return (
        <div className="space-y-4 p-8">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
        </div>
    )
}
```

---

## Ejemplo 2: Badge Avanzado con Múltiples Dimensiones

Las variants pueden tener múltiples dimensiones: color, tamaño, forma, etc.

```javascript
function Badge({ 
    variant = 'default',
    size = 'md',
    rounded = 'full',
    children 
}) {
    // Variants de color
    const colorVariants = {
        default: 'bg-gray-500 text-white',
        primary: 'bg-blue-500 text-white',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-black',
        danger: 'bg-red-500 text-white',
        outline: 'bg-transparent border-2 border-gray-500 text-gray-700'
    }
    
    // Variants de tamaño
    const sizeVariants = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    }
    
    // Variants de redondeo
    const roundedVariants = {
        none: 'rounded-none',
        sm: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
    }
    
    const baseStyles = 'inline-flex items-center font-medium'
    
    const className = `
        ${baseStyles}
        ${colorVariants[variant]}
        ${sizeVariants[size]}
        ${roundedVariants[rounded]}
    `.trim()
    
    return <span className={className}>{children}</span>
}

// Uso
<Badge variant="success" size="lg" rounded="md">
    ✓ Completado
</Badge>
```

---

## Ejemplo 3: Button Component Completo

Un botón con variants, sizes y estados.

```javascript
function Button({ 
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    children,
    onClick,
    type = 'button'
}) {
    // Variants de color y estilo
    const variantStyles = {
        primary: `
            bg-blue-600 text-white 
            hover:bg-blue-700 
            active:bg-blue-800
            disabled:bg-blue-300 disabled:cursor-not-allowed
        `,
        secondary: `
            bg-gray-600 text-white 
            hover:bg-gray-700 
            active:bg-gray-800
            disabled:bg-gray-300 disabled:cursor-not-allowed
        `,
        success: `
            bg-green-600 text-white 
            hover:bg-green-700 
            active:bg-green-800
            disabled:bg-green-300 disabled:cursor-not-allowed
        `,
        danger: `
            bg-red-600 text-white 
            hover:bg-red-700 
            active:bg-red-800
            disabled:bg-red-300 disabled:cursor-not-allowed
        `,
        outline: `
            bg-transparent border-2 border-gray-600 text-gray-700
            hover:bg-gray-100
            active:bg-gray-200
            disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
        `,
        ghost: `
            bg-transparent text-gray-700
            hover:bg-gray-100
            active:bg-gray-200
            disabled:text-gray-400 disabled:cursor-not-allowed
        `,
        link: `
            bg-transparent text-blue-600 underline
            hover:text-blue-700
            active:text-blue-800
            disabled:text-blue-300 disabled:cursor-not-allowed
        `
    }
    
    // Variants de tamaño
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    }
    
    // Estilos base
    const baseStyles = `
        inline-flex items-center justify-center
        font-medium rounded-md
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    `
    
    // Ancho completo
    const widthStyle = fullWidth ? 'w-full' : ''
    
    const className = `
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
    `.replace(/\s+/g, ' ').trim()
    
    return (
        <button 
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
```

### Uso del Button

```jsx
function App() {
    return (
        <div className="space-y-4 p-8">
            {/* Diferentes variants */}
            <div className="space-x-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
            </div>
            
            {/* Diferentes tamaños */}
            <div className="space-x-2">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
            </div>
            
            {/* Estados */}
            <div className="space-x-2">
                <Button variant="primary">Normal</Button>
                <Button variant="primary" disabled>Disabled</Button>
            </div>
            
            {/* Ancho completo */}
            <Button variant="primary" fullWidth>
                Full Width Button
            </Button>
            
            {/* Con iconos */}
            <Button variant="success" size="lg">
                <span className="mr-2">✓</span>
                Guardar Cambios
            </Button>
        </div>
    )
}
```

---

## Patrón Avanzado: Variants con Compound Variants

Algunas combinaciones de variants requieren estilos especiales.

```javascript
function Button({ variant = 'primary', size = 'md', icon = false, children }) {
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700'
    }
    
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    }
    
    // Compound variants: estilos especiales para combinaciones específicas
    const compoundVariants = {
        // Botón pequeño con icono necesita menos padding
        'sm-icon': 'px-2 py-1.5',
        // Botón grande con outline necesita más borde
        'lg-outline': 'border-3'
    }
    
    // Determina la clave del compound variant
    const compoundKey = icon ? `${size}-icon` : null
    const compoundStyle = compoundKey && compoundVariants[compoundKey]
    
    const className = `
        inline-flex items-center justify-center
        ${variantStyles[variant]}
        ${compoundStyle || sizeStyles[size]}
    `.trim()
    
    return <button className={className}>{children}</button>
}
```

---

## Mejores Prácticas

### 1. Define valores por defecto

```javascript
function Badge({ variant = 'default', size = 'md', children }) {
    // Siempre hay un valor por defecto
}
```

### 2. Valida las variants (opcional pero recomendado)

```javascript
function Badge({ variant = 'default', children }) {
    const validVariants = ['default', 'primary', 'success', 'warning', 'danger']
    
    if (!validVariants.includes(variant)) {
        console.warn(`Invalid variant: ${variant}. Using 'default'.`)
        variant = 'default'
    }
    
    // ... resto del código
}
```

### 3. Usa TypeScript para Type Safety

```typescript
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
    variant?: BadgeVariant
    size?: BadgeSize
    children: React.ReactNode
}

function Badge({ variant = 'default', size = 'md', children }: BadgeProps) {
    // TypeScript previene typos y valores inválidos
}
```

### 4. Separa la lógica de estilos

```javascript
// variants.js
export const badgeVariants = {
    default: 'bg-gray-500 text-white',
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    // ...
}

// Badge.jsx
import { badgeVariants } from './variants'

function Badge({ variant = 'default', children }) {
    return (
        <span className={`inline-flex ${badgeVariants[variant]}`}>
            {children}
        </span>
    )
}
```

### 5. Permite sobrescribir estilos

```javascript
function Badge({ variant = 'default', className = '', children }) {
    const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full'
    const variantStyle = variantStyles[variant]
    
    // El className del usuario se aplica al final
    return (
        <span className={`${baseStyles} ${variantStyle} ${className}`}>
            {children}
        </span>
    )
}

// Uso
<Badge variant="primary" className="shadow-lg">
    Custom Badge
</Badge>
```

---

## Comparación: Con y Sin Variants

### ❌ Sin Variants (Problemático)

```jsx
// Cada botón tiene estilos inline o clases únicas
<button className="bg-blue-600 text-white px-4 py-2 rounded">
    Primary
</button>
<button className="bg-red-600 text-white px-4 py-2 rounded">
    Danger
</button>
<button className="bg-green-500 text-white px-3 py-1.5 rounded text-sm">
    Success Small
</button>

// Problemas:
// - Duplicación de código
// - Inconsistencias (tamaños diferentes, paddings distintos)
// - Difícil de mantener
// - Sin centralización
```

### ✅ Con Variants (Limpio)

```jsx
<Button variant="primary">Primary</Button>
<Button variant="danger">Danger</Button>
<Button variant="success" size="sm">Success Small</Button>

// Ventajas:
// - API clara y consistente
// - Fácil de mantener
// - Estilos centralizados
// - Type-safe con TypeScript
```
---

## Conclusión

El patrón **Variants** es esencial para:
- Crear sistemas de diseño escalables
- Mantener consistencia visual
- Facilitar el mantenimiento
- Mejorar la experiencia del desarrollador

Empieza simple con variants básicas y evoluciona hacia sistemas más complejos según tus necesidades. La clave es encontrar el balance entre flexibilidad y simplicidad.