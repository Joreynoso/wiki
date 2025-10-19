# 🎨 React - Clases condicionales con clsx

> `clsx` es una utilidad pequeña (239 bytes) para construir strings de `className` de forma condicional. Combina clases y solo aplica las que cumplen la condición, ignorando valores falsos como `null`, `undefined` o `false`.

---

## 📦 Instalación

```bash
npm install clsx
```

---

## 1️⃣ Ejemplo básico: clsx con objeto

```jsx
import clsx from 'clsx'

export default function Button({ isActive, isDisabled }) {
  const buttonClass = clsx({
    'bg-blue-500': isActive,
    'bg-gray-300': isDisabled
  })

  return <button className={buttonClass}>Click me</button>
}
```

**¿Qué hace?** Guarda el resultado de `clsx` en `buttonClass` y lo usa en el `className`.

---

## 2️⃣ Ejemplo con map: Teclado de letras

```jsx
import clsx from 'clsx'

export default function Keyboard({ guessedLetters, currentWord }) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  return (
    <div>
      {alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        
        const letterClass = clsx({
          'correct': isCorrect,
          'wrong': isWrong
        })

        return (
          <button key={letter} className={letterClass}>
            {letter.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
```

---

## 3️⃣ Ejemplo con clases base + condicionales

```jsx
import clsx from 'clsx'

export default function Card({ isPremium, isActive }) {
  const cardClass = clsx(
    'p-4 rounded shadow',  // clases base (siempre se aplican)
    {
      'bg-gold border-yellow-500': isPremium,
      'bg-white border-gray-300': !isPremium,
      'opacity-50': !isActive
    }
  )

  return <div className={cardClass}>Contenido</div>
}
```

---

## 🎨 CSS de ejemplo

```css
button {
  padding: 10px 15px;
  margin: 4px;
  border: 2px solid #ccc;
  background: white;
}

button.correct {
  background: green;
  color: white;
}

button.wrong {
  background: gray;
  color: white;
}
```

---

## 4️⃣ Clase base que siempre se aplica

```jsx
const className = clsx(
  "chip",              // clase base (siempre se aplica)
  {
    lost: isLanguageLost  // clase condicional
  }
)
```

**¿Qué hace?** El primer argumento `"chip"` siempre se aplica. El objeto con las condiciones solo aplica las clases cuando son `true`.

---

## 💡 Ventaja de usar clsx

Sin `clsx`:

```jsx
className={`button ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
```

Con `clsx`:

```jsx
const btnClass = clsx("button", { active: isActive, disabled: isDisabled })
```
