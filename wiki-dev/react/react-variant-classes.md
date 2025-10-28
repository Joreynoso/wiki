# 🎨 React - Component Variants Pattern

> El patrón de Variants en React permite crear componentes reutilizables con múltiples variaciones visuales (como tamaños, colores y estilos) sin duplicar código. En lugar de crear un componente separado para cada variación, defines todas las posibles combinaciones de estilos en un solo componente y las seleccionás mediante props. Este patrón es especialmente útil con Tailwind CSS, donde podés mapear props a clases CSS específicas usando objetos lookup, manteniendo el código limpio, escalable y fácil de mantener.

---

## 🎯 ¿Qué son las Variants?

Las **variants** son diferentes versiones visuales de un mismo componente que se controlan mediante props.

### Ejemplo: Botón con variantes

En lugar de crear:
- `PrimaryButton`
- `SecondaryButton`
- `DangerButton`
- `SmallButton`
- `LargeButton`

Creás **un solo** componente `Button` con props `variant` y `size`.

---

## 📦 Patrón básico con objetos lookup

### `Button.jsx`

```jsx
export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children 
}) {
  // Clases base (siempre se aplican)
  const baseClasses = 'rounded font-semibold transition-colors'
  
  // Variants de color
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-yellow-500 text-black hover:bg-yellow-600'
  }
  
  // Variants de tamaño
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  // Combinar todas las clases
  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`
  
  return (
    <button className={className}>
      {children}
    </button>
  )
}
```

### Uso

```jsx
import Button from './Button'

export default function App() {
  return (
    <main>
      <Button>Default</Button>
      <Button variant="success" size="lg">Success Large</Button>
      <Button variant="danger" size="sm">Danger Small</Button>
      <Button variant="warning">Warning Medium</Button>
    </main>
  )
}
```

---

## 🎨 Con Tailwind y clsx

Para manejar clases condicionales de forma más limpia, usá `clsx`:

```bash
npm install clsx
```

### `Button.jsx` mejorado

```jsx
import clsx from 'clsx'

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  children,
  className,  // Permite extender estilos
  ...props 
}) {
  const classes = clsx(
    // Base
    'rounded font-semibold transition-colors',
    
    // Variants
    {
      'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
      'bg-gray-500 text-white hover:bg-gray-600': variant === 'secondary',
      'bg-green-500 text-white hover:bg-green-600': variant === 'success',
      'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
      'bg-yellow-500 text-black hover:bg-yellow-600': variant === 'warning',
    },
    
    // Sizes
    {
      'px-3 py-1 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
    },
    
    // Estados
    {
      'opacity-50 cursor-not-allowed': disabled
    },
    
    // Clases adicionales
    className
  )
  
  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
```

### Uso con estilos personalizados

```jsx
<Button 
  variant="primary" 
  size="lg"
  className="shadow-lg"  // Agregar sombra
>
  Custom Button
</Button>
```

---

## 💎 Con Class Variance Authority (CVA)

Para proyectos más grandes, usá `class-variance-authority`:

```bash
npm install class-variance-authority clsx tailwind-merge
```

### Helper: `lib/utils.js`

```js
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

### `Button.jsx` con CVA

```jsx
import { cva } from 'class-variance-authority'
import { cn } from './lib/utils'

const buttonVariants = cva(
  // Base classes
  'rounded font-semibold transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        warning: 'bg-yellow-500 text-black hover:bg-yellow-600',
        ghost: 'bg-transparent hover:bg-gray-100',
        link: 'bg-transparent underline hover:no-underline'
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        icon: 'p-2'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export default function Button({ 
  variant, 
  size, 
  className, 
  children, 
  ...props 
}) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  )
}
```

**Ventajas de CVA:**
- ✅ Sintaxis más limpia
- ✅ TypeScript support out-of-the-box
- ✅ Compound variants (combinaciones específicas)
- ✅ Default variants

---

## 🔗 Compound Variants

Estilos que se aplican solo cuando se combinan ciertas variants:

```jsx
const buttonVariants = cva(
  'rounded font-semibold transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-500 text-white'
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        lg: 'px-6 py-3 text-lg'
      }
    },
    // 👇 Compound Variants
    compoundVariants: [
      {
        variant: 'primary',
        size: 'lg',
        className: 'uppercase tracking-wide'  // Solo primary + lg
      }
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'sm'
    }
  }
)
```

---

## 🎨 Ejemplo completo: Badge component

```jsx
import clsx from 'clsx'

export default function Badge({ 
  variant = 'default', 
  size = 'md',
  rounded = true,
  children 
}) {
  const baseClasses = 'inline-flex items-center font-medium'
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  }
  
  const className = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    {
      'rounded-full': rounded,
      'rounded': !rounded
    }
  )
  
  return (
    <span className={className}>
      {children}
    </span>
  )
}
```

### Uso

```jsx
<Badge variant="success" size="sm">Active</Badge>
<Badge variant="danger" rounded={false}>Error</Badge>
<Badge variant="warning" size="lg">Pending</Badge>
```

---

## 📊 Ejemplo: Card con múltiples variants

```jsx
import clsx from 'clsx'

export default function Card({ 
  variant = 'default',
  padding = 'md',
  shadow = true,
  children 
}) {
  const classes = clsx(
    'rounded-lg',
    
    // Variant
    {
      'bg-white border border-gray-200': variant === 'default',
      'bg-blue-50 border border-blue-200': variant === 'info',
      'bg-green-50 border border-green-200': variant === 'success',
      'bg-red-50 border border-red-200': variant === 'danger'
    },
    
    // Padding
    {
      'p-4': padding === 'sm',
      'p-6': padding === 'md',
      'p-8': padding === 'lg'
    },
    
    // Shadow
    {
      'shadow-md': shadow
    }
  )
  
  return (
    <div className={classes}>
      {children}
    </div>
  )
}
```

---

## ⚠️ Errores comunes

### ❌ NO usar template literals dinámicos

```jsx
// ❌ MAL - Tailwind no detecta estas clases
const color = 'blue'
className={`bg-${color}-500`}  // No funciona

// ✅ BIEN - Usar objeto lookup
const colors = {
  blue: 'bg-blue-500',
  red: 'bg-red-500'
}
className={colors[color]}
```

### ❌ NO modificar clases directamente

```jsx
// ❌ MAL - Difícil de mantener
<button className={isActive ? 'bg-blue-500' : 'bg-gray-500'}>
  Button
</button>

// ✅ BIEN - Usar componente con variants
<Button variant={isActive ? 'primary' : 'secondary'}>
  Button
</Button>
```

---

## 🎯 Cuándo usar Variants

### ✅ Usar Variants cuando:
- Tenés múltiples versiones visuales del mismo componente
- Las variaciones son predecibles y limitadas
- Querés mantener consistencia en el diseño
- Necesitás componentes reutilizables

### ❌ NO usar Variants cuando:
- El componente tiene una sola versión
- Los estilos son únicos y no se reutilizan
- Las variaciones son infinitas o impredecibles

---

## 💡 Mejores prácticas

- ✅ Define valores por defecto para todas las variants
- ✅ Usa objetos lookup en lugar de condicionales
- ✅ Separa clases base de clases variantes
- ✅ Permite extender estilos con prop `className`
- ✅ Usa `clsx` o CVA para combinar clases
- ✅ Documenta las variants disponibles
- ✅ Considera TypeScript para autocomplete
- ✅ Mantén las variants simples y predecibles

---

## 🚀 Comparación de métodos

| Método | Complejidad | TypeScript | Tailwind Merge | Recomendado para |
|--------|-------------|------------|----------------|------------------|
| Objeto lookup básico | Baja | Manual | No | Proyectos pequeños |
| clsx | Media | Manual | No | Proyectos medianos |
| CVA | Media-Alta | Automático | Sí (con twMerge) | Proyectos grandes |

---

## 📚 Recursos

- [class-variance-authority](https://cva.style/docs)
- [clsx](https://github.com/lukeed/clsx)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)