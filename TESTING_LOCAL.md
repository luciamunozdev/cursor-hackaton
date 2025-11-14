# 🧪 Cómo Probar Múltiples Usuarios en Local

## Opciones Rápidas

### 1. **Múltiples Ventanas del Navegador** (Más Fácil)

**Chrome/Edge:**
- Abre una ventana normal
- Abre una ventana de incógnito (Ctrl+Shift+N / Cmd+Shift+N)
- Abre otra ventana de incógnito
- Cada ventana es una sesión independiente

**Firefox:**
- Ventana normal
- Ventana privada (Ctrl+Shift+P / Cmd+Shift+P)
- Múltiples ventanas privadas

### 2. **Diferentes Navegadores**

Simplemente usa:
- Chrome
- Firefox  
- Safari
- Edge

Cada uno mantiene su propia sesión de localStorage y cookies.

### 3. **Perfiles de Navegador** (Chrome/Edge)

1. Ve a `chrome://settings/manageProfile`
2. Haz clic en "Añadir" para crear un nuevo perfil
3. Nombra el perfil (ej: "Usuario 1", "Usuario 2")
4. Abre cada perfil en una ventana separada
5. Cada perfil tiene su propio localStorage

### 4. **Modo Desarrollo de Chrome**

1. Abre Chrome
2. Ve a `chrome://flags`
3. Busca "Enable multiple profiles"
4. Crea perfiles separados

## 🎯 Flujo de Prueba Recomendado

### Escenario: Probar una sala con 3 jugadores

1. **Ventana 1 (Admin):**
   - Abre `http://localhost:3000/admin`
   - Crea una sala
   - Copia el código o QR

2. **Ventana 2 (Jugador 1):**
   - Abre en modo incógnito
   - Ve a `http://localhost:3000/join/[CODIGO]`
   - Únete con nombre "Jugador 1"

3. **Ventana 3 (Jugador 2):**
   - Abre otra ventana incógnito
   - Ve a `http://localhost:3000/join/[CODIGO]`
   - Únete con nombre "Jugador 2"

4. **Ventana 4 (Jugador 3):**
   - Abre otra ventana incógnito o usa Firefox
   - Ve a `http://localhost:3000/join/[CODIGO]`
   - Únete con nombre "Jugador 3"

5. **En la ventana del Admin:**
   - Verifica que aparezcan los 3 jugadores
   - Haz clic en "Iniciar Juego"
   - Todos deberían ver las preguntas sincronizadas

## 💡 Tips Útiles

### Atajos de Teclado

**Chrome/Edge:**
- Nueva ventana: `Ctrl+N` / `Cmd+N`
- Nueva ventana incógnito: `Ctrl+Shift+N` / `Cmd+Shift+N`
- Nueva pestaña: `Ctrl+T` / `Cmd+T`

**Firefox:**
- Nueva ventana: `Ctrl+N` / `Cmd+N`
- Nueva ventana privada: `Ctrl+Shift+P` / `Cmd+Shift+P`

### Organizar Ventanas

- **Windows:** Usa `Win + ←` o `Win + →` para dividir pantalla
- **Mac:** Usa Mission Control para organizar ventanas
- **Linux:** Usa tu gestor de ventanas favorito

### Verificar que Funciona

1. Cada ventana debe tener su propio localStorage
2. Los cambios en una ventana no afectan a las otras
3. Puedes ver las actualizaciones en tiempo real en todas las ventanas

## 🔧 Script de Ayuda (Opcional)

Si quieres automatizar, puedes crear un script que abra múltiples ventanas:

**macOS (Terminal):**
```bash
# Abre múltiples ventanas de Chrome en modo incógnito
open -na "Google Chrome" --args --incognito --new-window "http://localhost:3000/admin"
open -na "Google Chrome" --args --incognito --new-window "http://localhost:3000"
open -na "Google Chrome" --args --incognito --new-window "http://localhost:3000"
```

**Windows (PowerShell):**
```powershell
# Abre múltiples ventanas de Chrome en modo incógnito
Start-Process chrome.exe -ArgumentList "--incognito", "http://localhost:3000/admin"
Start-Process chrome.exe -ArgumentList "--incognito", "http://localhost:3000"
Start-Process chrome.exe -ArgumentList "--incognito", "http://localhost:3000"
```

## ⚠️ Notas Importantes

1. **LocalStorage:** Cada ventana/incógnito tiene su propio localStorage
2. **Cookies:** Las ventanas incógnito no comparten cookies
3. **Supabase Realtime:** Funciona igual en todas las ventanas, todos verán los cambios
4. **Puerto:** Asegúrate de que todas las ventanas apunten a `localhost:3000`

## 🎮 Prueba Rápida

1. Abre 2 ventanas incógnito
2. En una, ve a `/admin` y crea una sala
3. En la otra, ve a `/join/[CODIGO]` y únete
4. Deberías ver ambos usuarios en tiempo real

