# 🎮 Configuración del Sistema Tipo Kahoot

## 📋 Resumen

Has transformado el quiz en un sistema tipo Kahoot donde:
- **Admin** crea una sala con dificultad y máximo de jugadores
- Se genera un **QR code** para que otros se unan
- Los jugadores se unen con su nombre y obtienen un **avatar aleatorio**
- El admin inicia el juego cuando todos están listos
- Todos ven las mismas preguntas **sincronizadas en tiempo real**
- Se muestran resultados y clasificación final

## 🗄️ Configuración de Base de Datos

### Paso 1: Ejecutar el script SQL

1. Ve a tu proyecto en Supabase → **SQL Editor**
2. Abre el archivo `supabase-kahoot-setup.sql`
3. Copia TODO el contenido
4. Pégalo en el SQL Editor de Supabase
5. Haz clic en **Run**

Este script crea:
- `game_rooms` - Tabla de salas de juego
- `room_participants` - Tabla de participantes
- `participant_answers` - Tabla de respuestas
- Políticas RLS para acceso público
- Función para generar códigos de sala

### Paso 2: Habilitar Realtime (IMPORTANTE)

Para que la sincronización en tiempo real funcione:

1. Ve a **Database** → **Replication** en Supabase
2. Habilita la replicación para estas tablas:
   - ✅ `game_rooms`
   - ✅ `room_participants`
   - ✅ `participant_answers`

O ejecuta este SQL:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE room_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE participant_answers;
```

## 🚀 Cómo Usar

### Para el Admin:

1. Ve a `/admin`
2. Ingresa tu nombre
3. Selecciona dificultad (Fácil, Medio, Difícil)
4. Ajusta el máximo de jugadores (2-20)
5. Haz clic en **"Crear Sala"**
6. Se genera un **código de sala** y un **QR code**
7. Comparte el QR o el código con los participantes
8. Espera a que se unan los jugadores
9. Cuando todos estén listos, haz clic en **"Iniciar Juego"**

### Para los Jugadores:

1. Escanea el QR code o ve a `/join/[CODIGO]`
2. Ingresa tu nombre
3. Haz clic en **"Unirse a la Sala"**
4. Espera a que el admin inicie el juego
5. Responde las preguntas cuando aparezcan
6. Ve tu posición en el leaderboard en tiempo real

## 📁 Estructura de Archivos

```
app/
  admin/page.tsx              # Página para crear salas (admin)
  join/[code]/page.tsx        # Página para unirse a una sala
  game-room/[roomId]/page.tsx # Página de juego sincronizado
  game-results/[roomId]/page.tsx # Página de resultados finales

lib/
  supabase/
    rooms.ts                  # Funciones para manejar salas
  utils/
    avatar.ts                 # Generación de avatares aleatorios
```

## 🎯 Características Implementadas

✅ Creación de salas con código único  
✅ Generación de QR codes  
✅ Sistema de avatares aleatorios (DiceBear)  
✅ Unirse a salas por código  
✅ Sincronización en tiempo real (Supabase Realtime)  
✅ Juego sincronizado para todos los participantes  
✅ Leaderboard en tiempo real  
✅ Resultados finales con clasificación  
✅ Máximo de jugadores configurable (2-20)  
✅ Diferentes niveles de dificultad  

## 🔧 Dependencias Añadidas

- `qrcode` y `react-qr-code` - Generación de QR codes
- `@dicebear/core` y `@dicebear/collection` - Generación de avatares
- Supabase Realtime - Sincronización en tiempo real

## ⚠️ Notas Importantes

1. **Realtime debe estar habilitado** en Supabase para que funcione la sincronización
2. El admin debe esperar en la página hasta que todos se unan
3. Los jugadores no pueden avanzar preguntas, solo el admin
4. Las respuestas se guardan automáticamente cuando se envían
5. El score se calcula en tiempo real

## 🐛 Solución de Problemas

### Los cambios no se sincronizan
- Verifica que Realtime esté habilitado en Supabase
- Revisa la consola del navegador para errores
- Asegúrate de que las políticas RLS permitan lectura/escritura

### No se puede crear una sala
- Verifica que el script SQL se ejecutó correctamente
- Revisa que las credenciales de Supabase estén en `.env.local`

### Los avatares no aparecen
- Verifica que `@dicebear/core` esté instalado
- Revisa la consola para errores de carga de imágenes

## 📝 Próximas Mejoras Posibles

- [ ] Timer por pregunta
- [ ] Mostrar respuestas correctas después de cada pregunta
- [ ] Estadísticas detalladas por jugador
- [ ] Historial de partidas
- [ ] Sonidos y animaciones
- [ ] Modo espectador

