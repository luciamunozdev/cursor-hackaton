# 📋 Paso a Paso: Configuración de Supabase

## Paso 1: Crear cuenta y proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign in"** si ya tienes cuenta
3. Si es tu primera vez, crea una cuenta (puedes usar GitHub, Google, etc.)
4. Una vez dentro, haz clic en **"New Project"**
5. Completa el formulario:
   - **Name**: Ponle un nombre (ej: "cursor-hackathon-quiz")
   - **Database Password**: Crea una contraseña segura (¡guárdala!)
   - **Region**: Elige la región más cercana a ti
   - **Pricing Plan**: Selecciona "Free" (es suficiente para empezar)
6. Haz clic en **"Create new project"**
7. ⏳ Espera 2-3 minutos mientras se crea el proyecto

---

## Paso 2: Obtener las credenciales (URL y Key)

1. Una vez que el proyecto esté listo, verás el dashboard
2. En el menú lateral izquierdo, haz clic en **⚙️ Settings** (icono de engranaje)
3. Luego haz clic en **API** en el submenú
4. En la sección **"Project API keys"**, encontrarás:
   - **Project URL**: Es una URL que se ve así: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key: Es una cadena larga que empieza con `eyJhbGc...`
5. **Copia ambos valores** (los necesitarás en el siguiente paso)

---

## Paso 3: Crear la tabla en la base de datos

1. En el menú lateral izquierdo, haz clic en **SQL Editor** (icono de terminal/consola)
2. Haz clic en **"New query"** (botón verde en la parte superior)
3. Abre el archivo `supabase-setup.sql` que está en la raíz de tu proyecto
4. **Copia TODO el contenido** del archivo
5. Pégalo en el editor SQL de Supabase
6. Haz clic en **"Run"** (botón en la parte inferior derecha) o presiona `Ctrl+Enter` (Windows/Linux) o `Cmd+Enter` (Mac)
7. Deberías ver un mensaje de éxito: ✅ "Success. No rows returned"
8. Para verificar que se creó la tabla:
   - En el menú lateral, haz clic en **Table Editor**
   - Deberías ver la tabla `quiz_results` en la lista

---

## Paso 4: Crear el archivo de variables de entorno

1. En tu proyecto local (en Cursor/VS Code), ve a la raíz del proyecto (`/Users/guille/dev/cursor-hackaton`)
2. Crea un nuevo archivo llamado `.env.local` (con el punto al inicio)
3. Abre el archivo y pega esto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

4. Reemplaza `tu_project_url_aqui` con el **Project URL** que copiaste en el Paso 2
5. Reemplaza `tu_anon_key_aqui` con el **anon public key** que copiaste en el Paso 2

**Ejemplo de cómo debería verse:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI4MCwiZXhwIjoxOTU0NTQzMjgwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

6. **Guarda el archivo** (Cmd+S o Ctrl+S)

---

## Paso 5: Reiniciar el servidor de desarrollo

1. Ve a la terminal donde está corriendo `bun run dev`
2. Detén el servidor presionando `Ctrl+C` (o `Cmd+C` en Mac)
3. Vuelve a iniciarlo con:
   ```bash
   bun run dev
   ```
4. Espera a que el servidor inicie (verás "Ready" en la terminal)

---

## Paso 6: Probar que funciona

1. Abre tu navegador en `http://localhost:3000`
2. Haz clic en **"Comenzar"**
3. Ingresa tu nombre y selecciona un nivel
4. Completa el quiz
5. En la página de resultados, deberías ver:
   - Un mensaje de toast verde que dice "Resultado guardado en el leaderboard"
   - Un botón "Ver Leaderboard"
6. Haz clic en **"Ver Leaderboard"**
7. Deberías ver tu resultado en la lista 🎉

---

## ✅ Verificación final

Para asegurarte de que todo está bien:

1. **En Supabase:**
   - Ve a **Table Editor** → `quiz_results`
   - Deberías ver tu resultado guardado

2. **En la app:**
   - Ve a `/leaderboard`
   - Tu resultado debería aparecer en la lista
   - Prueba los filtros (Todos, Fácil, Medio, Difícil)

---

## 🆘 Si algo no funciona

### Error: "Invalid API key"
- ✅ Verifica que copiaste correctamente las credenciales en `.env.local`
- ✅ Asegúrate de que no hay espacios extra antes o después de los valores
- ✅ Reinicia el servidor después de cambiar `.env.local`

### Error: "relation does not exist"
- ✅ Verifica que ejecutaste el script SQL correctamente
- ✅ Ve a **Table Editor** en Supabase y confirma que existe la tabla `quiz_results`

### No se guardan los resultados
- ✅ Abre la consola del navegador (F12) y revisa si hay errores
- ✅ Verifica que las políticas RLS estén activas (en Supabase: Authentication → Policies)

### El leaderboard está vacío
- ✅ Completa un quiz primero para tener datos
- ✅ Verifica que el resultado se guardó en Supabase (Table Editor)

---

## 📝 Resumen rápido

1. ✅ Crear proyecto en Supabase
2. ✅ Copiar URL y anon key desde Settings → API
3. ✅ Ejecutar script SQL en SQL Editor
4. ✅ Crear `.env.local` con las credenciales
5. ✅ Reiniciar servidor (`bun run dev`)
6. ✅ Probar completando un quiz

¡Listo! 🚀

