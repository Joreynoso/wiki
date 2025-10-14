# 🧩 REACT + AXIOS - Paginación, filtros múltiples y ordenamiento

> Crear un flujo completo para manejar una lista de datos paginada con filtros dinámicos usando Context API y axios.

---

## 📁 Estructura del proyecto

```md
src/
├── context/
│   └── gamesContext.jsx
├── pages/
│   └── GamesPage.jsx
└── api/
    └── games.js
```

---

## 📄 `context/gamesContext.jsx`

```jsx
import { useState, createContext, useContext, useEffect } from 'react'
import axios from 'axios'

// Crear el contexto global
export const GameContext = createContext(null)

export const GameProvider = ({ children }) => {
  // Estado principal de datos
  const [games, setGames] = useState([])

  // Filtros
  const [genres, setGenres] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [genre, setGenre] = useState('')
  const [platform, setPlatform] = useState('')
  const [sort, setSort] = useState('desc')
  const [q, setQ] = useState('')

  // Paginación
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  // Control de estado
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ✅ Obtener datos con filtros, búsqueda y ordenamiento
  const getAllGames = async ({
    page = 1,
    limit = 10,
    genre,
    platform,
    sort = 'desc',
    q
  }) => {
    setLoading(true)
    setError(null)
    try {
      // Construimos parámetros dinámicos
      const params = { page, limit, sort }
      if (genre) params.genre = genre
      if (platform) params.platform = platform
      if (q) params.q = q

      // Petición HTTP
      const { data } = await axios.get('/api/games', { params })

      // Actualizamos estado global
      setGames(data.games || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err.message)
      setGames([])
    } finally {
      setLoading(false)
    }
  }

  // ✅ Obtener opciones de filtros
  const getAllGenres = async () => {
    try {
      const { data } = await axios.get('/api/games/all-genres')
      setGenres(data.totalGenres || [])
    } catch {
      setGenres([])
    }
  }

  const getAllPlatforms = async () => {
    try {
      const { data } = await axios.get('/api/games/all-platforms')
      setPlatforms(data.totalPlatforms || [])
    } catch {
      setPlatforms([])
    }
  }

  // ✅ Efectos: disparar peticiones según cambios
  useEffect(() => {
    getAllGames({ page, limit, genre, platform, sort, q })
  }, [page, genre, platform, sort, q])

  useEffect(() => {
    getAllGenres()
    getAllPlatforms()
  }, [])

  return (
    <GameContext.Provider
      value={{
        games,
        genres,
        platforms,
        loading,
        error,
        page,
        setPage,
        totalPages,
        genre,
        setGenre,
        platform,
        setPlatform,
        sort,
        setSort,
        q,
        setQ
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

// Custom Hook para usar el contexto
export const useGame = () => useContext(GameContext)
```

---

## 📄 `pages/GamesPage.jsx`

```jsx
import { useState, useEffect } from 'react'
import { useGame } from '../context/gamesContext'

export default function GamesPage() {
  // ✅ Extraer datos y acciones del contexto
  const {
    games,
    genres,
    platforms,
    loading,
    error,
    page,
    setPage,
    totalPages,
    genre,
    setGenre,
    platform,
    setPlatform,
    sort,
    setSort,
    q,
    setQ
  } = useGame()

  const [search, setSearch] = useState(q || '')

  // 🧠 Debounce: retrasa la búsqueda hasta que el usuario deje de escribir
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1)
      setQ(search.trim())
    }, 800)
    return () => clearTimeout(timeout)
  }, [search])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h2>Lista de juegos</h2>

      {/* 🔍 Búsqueda */}
      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🎮 Filtro por género */}
      <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1) }}>
        <option value="">Todos los géneros</option>
        {genres.map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      {/* 🕹️ Filtro por plataforma */}
      <select value={platform} onChange={(e) => { setPlatform(e.target.value); setPage(1) }}>
        <option value="">Todas las plataformas</option>
        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      {/* 🔄 Ordenamiento */}
      <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }}>
        <option value="desc">Más recientes</option>
        <option value="asc">Más antiguos</option>
      </select>

      {/* 🧹 Limpiar filtros */}
      <button onClick={() => {
        setGenre('')
        setPlatform('')
        setSort('desc')
        setQ('')
        setPage(1)
      }}>
        Limpiar
      </button>

      {/* 🧾 Lista de resultados */}
      {games.length > 0 ? (
        <ul>
          {games.map(g => (
            <li key={g._id}>{g.name}</li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron juegos.</p>
      )}

      {/* 📄 Paginación */}
      <div>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
        <span> Página {page} de {totalPages} </span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>
    </div>
  )
}
```

---

## 🎯 Características implementadas

- ✅ **Context API**: Estado global centralizado
- ✅ **Paginación**: Control de páginas con límites
- ✅ **Filtros dinámicos**: Género, plataforma y ordenamiento
- ✅ **Búsqueda con debounce**: Optimiza llamadas a la API
- ✅ **Manejo de estados**: Loading, error y resultados vacíos
