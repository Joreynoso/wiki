# 🧩 Lista de objetos con componentes y parámetros en React / Next.js

/*
META: Ejemplo básico de cómo pasar un parámetro desde una página (CategoryPage)
hacia un componente de lista (ModelsGrid), que a su vez renderiza un componente hijo (ModelCard).
*/

---

## 📦 Estructura general

CategoryPage (recibe params)
└── ModelsGrid (recibe title y models)
└── ModelCard (recibe model individual)

---

## 📄 1. Componente `ModelsGrid`

```tsx
import ModelCard from "@/app/components/ModelCard"
import { ModelsGridProps, Model } from "@/app/types"

export default function ModelsGrid({ title, models }: ModelsGridProps) {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">{title}</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {models.map((model: Model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  )
}

---

## 📄 2. Página CategoryPage 

import ModelsGrid from "@/app/components/ModelsGrid"
import { getCategoryBySlug } from "@/app/lib/categories"
import { getModels } from "@/app/lib/models"
import type { CategoryPageProps } from "@/types"

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryName } = await params
  const category = getCategoryBySlug(categoryName)

  console.log("category -->", category)

  const listOfModelsByCategory = await getModels({ category: categoryName })

  return (
    <ModelsGrid
      title={categoryName}
      models={listOfModelsByCategory}
    />
  )
}

--- 

## 🧠 Concepto clave

Un parámetro dinámico (por ejemplo, el categoryName en la ruta /category/[categoryName])
se usa para filtrar datos y pasarlos como props hacia componentes de presentación. 

