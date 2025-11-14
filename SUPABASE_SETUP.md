# Configuración de Supabase para el Leaderboard

Este documento explica cómo configurar Supabase para el leaderboard del quiz.

## Pasos de configuración

### 1. Crear un proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración (puede tardar unos minutos)

### 2. Obtener las credenciales

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (será tu `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3. Crear la tabla en Supabase

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `supabase-setup.sql`
3. Haz clic en **Run** para ejecutar el script
4. Verifica que la tabla `quiz_results` se haya creado correctamente

### 4. Configurar las variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto (si no existe)
2. Añade las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Ejemplo:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Reiniciar el servidor de desarrollo

Después de configurar las variables de entorno, reinicia el servidor:

```bash
# Detén el servidor actual (Ctrl+C) y vuelve a iniciarlo
bun run dev
```

## Estructura de la tabla

La tabla `quiz_results` tiene los siguientes campos:

- `id` (UUID): Identificador único (generado automáticamente)
- `player_name` (TEXT): Nombre del jugador
- `difficulty` (TEXT): Nivel de dificultad ('fácil', 'medio', 'difícil')
- `total_time` (INTEGER): Tiempo total en segundos
- `correct_answers` (INTEGER): Número de respuestas correctas
- `total_questions` (INTEGER): Número total de preguntas
- `score_percentage` (INTEGER): Porcentaje de aciertos (0-100)
- `created_at` (TIMESTAMP): Fecha y hora de creación (generado automáticamente)

## Políticas de seguridad (RLS)

El script configura Row Level Security (RLS) con las siguientes políticas:

- **Lectura pública**: Todos pueden ver el leaderboard
- **Inserción pública**: Todos pueden guardar resultados

Esto permite que cualquier usuario pueda ver y añadir resultados sin necesidad de autenticación.

## Verificación

Para verificar que todo funciona:

1. Completa un quiz
2. En la página de resultados, deberías ver un mensaje de éxito cuando se guarde
3. Ve al leaderboard (`/leaderboard`) y verifica que tu resultado aparezca

## Solución de problemas

### Error: "Invalid API key"
- Verifica que hayas copiado correctamente las credenciales
- Asegúrate de que las variables de entorno estén en `.env.local` (no `.env`)
- Reinicia el servidor después de cambiar las variables

### Error: "relation does not exist"
- Verifica que hayas ejecutado el script SQL correctamente
- Revisa que la tabla `quiz_results` exista en el SQL Editor de Supabase

### No se guardan los resultados
- Revisa la consola del navegador para ver errores
- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de que la tabla tenga los permisos correctos

