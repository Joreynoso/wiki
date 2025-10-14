# 🧩 API Node.js + Mongoose - Paginación y filtros múltiples

> Crear un endpoint que devuelva una lista de juegos con paginación, filtros dinámicos, búsqueda por nombre y ordenamiento.

---

## 📁 Estructura sugerida

```md
src/
├── repositories/
│   └── GameRepository.js
├── services/
│   └── GameService.js
├── controllers/
│   └── GameController.js
└── models/
    └── VideoGame.js
```

---

## 📄 `repositories/GameRepository.js`

```js
// Repositorio que interactúa directamente con la base de datos
import VideoGame from '@/models/VideoGame'

export default class GameRepository {
  // Devuelve juegos con filtros, ordenamiento y paginación
  static async getAll({ filter = {}, sortOption = {}, skip = 0, limit = 20 }) {
    const games = await VideoGame.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)

    const total = await VideoGame.countDocuments(filter)

    return { games, total }
  }
}
```

---

## 📄 `services/GameService.js`

```js
// Lógica de negocio: preparar filtros y opciones de sorteo
import GameRepository from '@/repositories/GameRepository'

export default class GameService {
  // Construye filtros, paginación y delega al repositorio
  static async getAllGames({ page = 1, limit = 20, genre, platform, sort = "desc", q }) {
    const skip = (page - 1) * limit
    const filter = {}

    // filtros dinámicos
    if (genre) filter.genres = { $in: [genre] }
    if (platform) filter.platforms = { $in: [platform] }

    // búsqueda por nombre
    if (q) filter.name = { $regex: q, $options: "i" }

    // ordenamiento
    const sortOption = {}
    if (sort === "asc") sortOption.released = 1
    if (sort === "desc") sortOption.released = -1

    return GameRepository.getAll({ filter, sortOption, skip, limit })
  }
}
```

---

## 📄 `controllers/GameController.js`

```js
// Controlador de la API: recibe req/res y responde al cliente
import GameService from '@/services/GameService'

export default class GameController {
  // Endpoint principal para obtener lista de juegos
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 20, genre, platform, sort = "desc", q } = req.query

      const { games, total } = await GameService.getAllGames({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        genre,
        platform,
        sort,
        q
      })

      if (!games.length) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron juegos"
        })
      }

      return res.status(200).json({
        success: true,
        message: "Lista de juegos",
        page: Number(page),
        total,
        totalPages: Math.ceil(total / limit),
        count: games.length,
        games
      })
    } catch (error) {
      console.error('❌ Error en GameController.getAll:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }
}
```

---

## 🎯 Características implementadas

- ✅ **Paginación**: `page` y `limit`
- ✅ **Filtros dinámicos**: `genre`, `platform`
- ✅ **Búsqueda**: `q` (búsqueda por nombre)
- ✅ **Ordenamiento**: `sort` (asc/desc)
- ✅ **Respuesta completa**: página actual, total, totalPages, cantidad y datos
