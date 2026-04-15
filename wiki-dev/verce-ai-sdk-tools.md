# Vercel AI SDK — Tool Calling

Patrón para conectar un LLM a funciones reales de tu app. Cambiás de proveedor con una sola línea.

---

## Instalación

```bash
npm install ai zod

# elegí uno:
npm install @ai-sdk/google      # Google Gemini ← recomendado
npm install @ai-sdk/anthropic   # Claude
npm install @ai-sdk/openai      # GPT
npm install @ai-sdk/groq        # Llama (requiere fix de schema)
npm install @ai-sdk/cohere      # Command-R
```

Variables de entorno en `.env.local`:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=...   # Google
ANTHROPIC_API_KEY=...              # Anthropic
OPENAI_API_KEY=...                 # OpenAI
GROQ_API_KEY=...                   # Groq
CO_API_KEY=...                     # Cohere
```

---

## Modelos compatibles

| Provider | Modelo | Capa gratuita | Tool use |
|---|---|---|---|
| `@ai-sdk/google` | `gemini-2.0-flash` | ✅ Generosa | ✅ |
| `@ai-sdk/groq` | `llama-3.3-70b-versatile` | ✅ Muy rápido | ⚠️ Fix requerido |
| `@ai-sdk/anthropic` | `claude-sonnet-4-5` | ❌ Pago | ✅ |
| `@ai-sdk/openai` | `gpt-4o` | ❌ Pago | ✅ |
| `@ai-sdk/cohere` | `command-r` | ✅ Con registro | ✅ |

---

## Estructura

```
app/api/chat/
├── route.ts              ← cerebro: recibe mensajes, llama al LLM
└── tools/
    ├── ping.tool.ts      ← tool de test
    └── create-form.tool.ts  ← tool real
```

---

## Tool de test

`app/api/chat/tools/ping.tool.ts`

```typescript
import { tool } from 'ai'
import { z } from 'zod'

export const pingTool = tool({
  description: 'Responde pong. Úsala para verificar que las tools funcionan.',
  parameters: z.object({
    message: z.string()
  }),
  execute: async ({ message }) => {
    return { pong: true, received: message }
  }
})
```

---

## Tool real

`app/api/chat/tools/create-form.tool.ts`

```typescript
import { tool } from 'ai'
import { z } from 'zod'
import { createForm } from '@/actions/forms/crud'

export const createFormTool = tool({
  description: 'Crea un formulario vacío con título y descripción.',
  parameters: z.object({
    title: z.string(),
    description: z.string(),
  }),
  execute: async ({ title, description }) => {
    return await createForm(title, description)
  }
})
```

---

## Route

`app/api/chat/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { google } from '@ai-sdk/google'   // ← única línea que cambia al cambiar provider
import { streamText } from 'ai'
import { pingTool } from './tools/ping.tool'
import { createFormTool } from './tools/create-form.tool'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: `Eres un asistente médico. Tenés tools para gestionar formularios.
               Cuando el usuario quiera crear un formulario, usá createForm.
               Nunca lo hagas en texto plano.`,
      messages,
      tools: {
        ping: pingTool,
        createForm: createFormTool,
      }
    })

    return result.toTextStreamResponse()

  } catch (error) {
    console.error('Error en /api/chat:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

---

## Cambiar de provider

Solo cambiás el import y el modelo. **Todo lo demás queda igual.**

```typescript
// Google
import { google } from '@ai-sdk/google'
model: google('gemini-2.0-flash')

// Anthropic
import { anthropic } from '@ai-sdk/anthropic'
model: anthropic('claude-sonnet-4-5')

// OpenAI
import { openai } from '@ai-sdk/openai'
model: openai('gpt-4o')

// Cohere
import { cohere } from '@ai-sdk/cohere'
model: cohere('command-r')
```

---

## Fix para Groq

Groq requiere `additionalProperties: false` en el schema. Agregá `.strict()` en cada tool:

```typescript
parameters: z.object({
  title: z.string(),
  description: z.string(),
}).strict()  // ← esto
```

> Si sigue fallando, usá el SDK nativo `groq-sdk` con JSON Schema puro en lugar de Zod.
