# 🐘 PostgreSQL - Consultas y optimización

> PostgreSQL utiliza un optimizador de consultas basado en costos que intenta transformar tus consultas SQL en algo eficiente que se ejecute en el menor tiempo posible. El optimizador analiza múltiples estrategias de ejecución (como diferentes tipos de JOINs y uso de índices) y elige la que estima con menor costo. Comprender cómo funciona el optimizador y qué técnicas usar para ayudarlo es clave para escribir consultas rápidas y eficientes, especialmente cuando trabajás con tablas grandes o relaciones complejas.

---

## 📊 Base de datos de ejemplo

### Schema simple: Blog con usuarios y posts

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de posts (1:muchos con users)
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Datos de prueba
INSERT INTO users (name, email) VALUES
  ('Ana García', 'ana@example.com'),
  ('Juan Pérez', 'juan@example.com'),
  ('María López', 'maria@example.com');

INSERT INTO posts (title, content, user_id, published, views) VALUES
  ('Introducción a PostgreSQL', 'PostgreSQL es...', 1, true, 150),
  ('Optimización de queries', 'Aprende a optimizar...', 1, true, 200),
  ('Borrador de post', 'Este es un borrador', 1, false, 0),
  ('Mi primer post', 'Hola mundo', 2, true, 50),
  ('Tutorial de SQL', 'SQL es fácil...', 3, true, 300);
```

---

## 1️⃣ Consultas básicas (SELECT)

### Seleccionar todos los usuarios

```sql
SELECT * FROM users;
```

### Seleccionar campos específicos

```sql
SELECT id, name, email FROM users;
```

### Filtrar con WHERE

```sql
-- Posts publicados
SELECT * FROM posts WHERE published = true;

-- Posts con más de 100 vistas
SELECT * FROM posts WHERE views > 100;

-- Buscar por texto
SELECT * FROM posts WHERE title LIKE '%PostgreSQL%';

-- Búsqueda case-insensitive
SELECT * FROM posts WHERE title ILIKE '%postgresql%';
```

### Ordenar resultados

```sql
-- Ordenar por vistas descendente
SELECT * FROM posts ORDER BY views DESC;

-- Ordenar por múltiples columnas
SELECT * FROM posts 
ORDER BY published DESC, views DESC;
```

### Limitar resultados

```sql
-- Top 3 posts más vistos
SELECT * FROM posts 
ORDER BY views DESC 
LIMIT 3;

-- Paginación (página 2, 10 items por página)
SELECT * FROM posts 
ORDER BY created_at DESC 
LIMIT 10 OFFSET 10;
```

---

## 2️⃣ Consultas con JOIN

### INNER JOIN (solo registros con coincidencias)

```sql
-- Posts con información del autor
SELECT 
  posts.id,
  posts.title,
  posts.views,
  users.name AS author
FROM posts
INNER JOIN users ON posts.user_id = users.id;
```

### LEFT JOIN (todos los registros de la izquierda)

```sql
-- Todos los usuarios con sus posts (incluso sin posts)
SELECT 
  users.name,
  posts.title
FROM users
LEFT JOIN posts ON users.id = posts.user_id;
```

### JOIN con filtros

```sql
-- Posts publicados con autor
SELECT 
  users.name,
  posts.title,
  posts.views
FROM posts
INNER JOIN users ON posts.user_id = users.id
WHERE posts.published = true
ORDER BY posts.views DESC;
```

---

## 3️⃣ Funciones de agregación

### COUNT, SUM, AVG, MAX, MIN

```sql
-- Contar posts totales
SELECT COUNT(*) FROM posts;

-- Contar posts publicados
SELECT COUNT(*) FROM posts WHERE published = true;

-- Total de vistas
SELECT SUM(views) FROM posts;

-- Promedio de vistas
SELECT AVG(views) FROM posts WHERE published = true;

-- Post más visto
SELECT MAX(views) FROM posts;
```

### GROUP BY

```sql
-- Cantidad de posts por usuario
SELECT 
  users.name,
  COUNT(posts.id) AS total_posts
FROM users
LEFT JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name;

-- Total de vistas por usuario
SELECT 
  users.name,
  SUM(posts.views) AS total_views
FROM users
INNER JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name
ORDER BY total_views DESC;
```

### HAVING (filtrar después de GROUP BY)

```sql
-- Usuarios con más de 2 posts
SELECT 
  users.name,
  COUNT(posts.id) AS total_posts
FROM users
INNER JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name
HAVING COUNT(posts.id) > 2;
```

---

## 4️⃣ Subqueries (Subconsultas)

### Subquery en WHERE

```sql
-- Posts del usuario más activo
SELECT * FROM posts
WHERE user_id = (
  SELECT user_id 
  FROM posts 
  GROUP BY user_id 
  ORDER BY COUNT(*) DESC 
  LIMIT 1
);
```

### Subquery en FROM

```sql
-- Usuarios con su cantidad de posts
SELECT 
  users.name,
  post_counts.total
FROM users
INNER JOIN (
  SELECT user_id, COUNT(*) AS total
  FROM posts
  GROUP BY user_id
) post_counts ON users.id = post_counts.user_id;
```

### EXISTS (verificar existencia)

```sql
-- Usuarios que tienen al menos un post publicado
SELECT * FROM users
WHERE EXISTS (
  SELECT 1 FROM posts 
  WHERE posts.user_id = users.id 
  AND posts.published = true
);
```

### NOT EXISTS (verificar no existencia)

```sql
-- Usuarios sin posts
SELECT * FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM posts 
  WHERE posts.user_id = users.id
);
```

---

## 5️⃣ Common Table Expressions (CTE)

### WITH simple

```sql
-- Separar lógica compleja en partes
WITH published_posts AS (
  SELECT * FROM posts WHERE published = true
)
SELECT 
  users.name,
  COUNT(published_posts.id) AS published_count
FROM users
INNER JOIN published_posts ON users.id = published_posts.user_id
GROUP BY users.id, users.name;
```

### CTE múltiples

```sql
WITH 
  active_users AS (
    SELECT user_id FROM posts GROUP BY user_id HAVING COUNT(*) > 1
  ),
  top_posts AS (
    SELECT * FROM posts WHERE views > 100
  )
SELECT 
  users.name,
  top_posts.title,
  top_posts.views
FROM users
INNER JOIN active_users ON users.id = active_users.user_id
INNER JOIN top_posts ON users.id = top_posts.user_id;
```

---

## 6️⃣ Índices para optimización

### Crear índices básicos

```sql
-- Índice en columna individual
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Índice en columna booleana
CREATE INDEX idx_posts_published ON posts(published);

-- Índice en columna de texto (para búsquedas)
CREATE INDEX idx_posts_title ON posts(title);
```

### Índices compuestos

```sql
-- Índice compuesto (orden importa)
CREATE INDEX idx_posts_user_published ON posts(user_id, published);

-- Útil para queries como:
SELECT * FROM posts 
WHERE user_id = 1 AND published = true;
```

### Índices parciales

```sql
-- Solo indexar posts publicados
CREATE INDEX idx_posts_published_only 
ON posts(user_id) 
WHERE published = true;

-- Más eficiente que indexar toda la columna
```

### Ver índices de una tabla

```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'posts';
```

### Eliminar índice

```sql
DROP INDEX idx_posts_title;
```

---

## 7️⃣ EXPLAIN y EXPLAIN ANALYZE

### EXPLAIN (plan de ejecución)

```sql
EXPLAIN 
SELECT * FROM posts WHERE user_id = 1;
```

**Output ejemplo:**
```
Index Scan using idx_posts_user_id on posts
  Index Cond: (user_id = 1)
```

### EXPLAIN ANALYZE (ejecución real)

```sql
EXPLAIN ANALYZE
SELECT 
  users.name,
  COUNT(posts.id) AS total_posts
FROM users
INNER JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name;
```

**Qué buscar:**
- **Seq Scan** (escaneo secuencial) → LENTO en tablas grandes
- **Index Scan** → RÁPIDO
- **Nested Loop** → Puede ser lento con muchos registros
- **Hash Join** → Rápido para tablas grandes
- **Actual time** → Tiempo real de ejecución

---

## 8️⃣ Optimización de queries

### ❌ Query lenta (sin índice)

```sql
-- Escaneo secuencial completo
SELECT * FROM posts WHERE user_id = 1;
```

### ✅ Query optimizada (con índice)

```sql
-- Crear índice
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Ahora usa Index Scan
SELECT * FROM posts WHERE user_id = 1;
```

### ❌ JOIN con subquery correlacionada (lenta)

```sql
SELECT 
  users.name,
  (SELECT COUNT(*) FROM posts WHERE posts.user_id = users.id) AS total_posts
FROM users;
```

### ✅ JOIN normal (rápida)

```sql
SELECT 
  users.name,
  COUNT(posts.id) AS total_posts
FROM users
LEFT JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name;
```

### ❌ SELECT * (trae columnas innecesarias)

```sql
SELECT * FROM posts 
INNER JOIN users ON posts.user_id = users.id;
```

### ✅ SELECT específico (solo lo necesario)

```sql
SELECT 
  posts.id,
  posts.title,
  users.name
FROM posts 
INNER JOIN users ON posts.user_id = users.id;
```

### ❌ NOT IN con subquery (puede ser lento)

```sql
-- Puede fallar si hay NULLs
SELECT * FROM users 
WHERE id NOT IN (SELECT user_id FROM posts);
```

### ✅ NOT EXISTS (más eficiente)

```sql
SELECT * FROM users 
WHERE NOT EXISTS (
  SELECT 1 FROM posts WHERE posts.user_id = users.id
);
```

---

## 9️⃣ Funciones de ventana (Window Functions)

### ROW_NUMBER (numerar filas)

```sql
-- Numerar posts por usuario
SELECT 
  user_id,
  title,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY views DESC) AS rank
FROM posts;
```

### RANK y DENSE_RANK

```sql
-- Ranking de posts por vistas
SELECT 
  title,
  views,
  RANK() OVER (ORDER BY views DESC) AS rank
FROM posts;
```

### Agregaciones con ventanas

```sql
-- Total de vistas por usuario sin GROUP BY
SELECT 
  users.name,
  posts.title,
  posts.views,
  SUM(posts.views) OVER (PARTITION BY users.id) AS user_total_views
FROM posts
INNER JOIN users ON posts.user_id = users.id;
```

---

## 🔟 Tips de optimización

### 1. Usar LIMIT para queries exploratorias

```sql
-- No cargar millones de registros
SELECT * FROM posts LIMIT 100;
```

### 2. Filtrar antes de agregar (WHERE antes de JOIN)

```sql
-- ✅ Filtrar primero
SELECT users.name, COUNT(posts.id)
FROM users
INNER JOIN posts ON users.id = posts.user_id
WHERE posts.published = true
GROUP BY users.id, users.name;
```

### 3. Usar índices en columnas de JOIN y WHERE

```sql
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published);
```

### 4. VACUUM y ANALYZE regularmente

```sql
-- Actualizar estadísticas para mejor optimización
ANALYZE posts;

-- Limpiar y optimizar
VACUUM ANALYZE posts;
```

### 5. Usar pg_stat_statements para encontrar queries lentas

```sql
-- Habilitar extensión (como superuser)
CREATE EXTENSION pg_stat_statements;

-- Ver queries más lentas
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## 🚀 Mejores prácticas

- ✅ Usa `EXPLAIN ANALYZE` para entender el plan de ejecución
- ✅ Crea índices en columnas usadas en `WHERE`, `JOIN` y `ORDER BY`
- ✅ Evita `SELECT *`, especifica solo columnas necesarias
- ✅ Usa `EXISTS` en lugar de `IN` para subqueries
- ✅ Prefiere `JOIN` sobre subqueries correlacionadas
- ✅ Usa `LIMIT` para paginación
- ✅ Ejecuta `VACUUM ANALYZE` regularmente
- ✅ Monitorea queries lentas con `pg_stat_statements`
- ✅ Considera índices parciales para filtros específicos
- ✅ Usa CTEs para queries complejas y legibilidad