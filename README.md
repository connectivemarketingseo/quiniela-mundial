# 🏆 Quiniela Mundial 2026

App completa para hacer quiniela del Mundial 2026 con tus amigos.
Gratis, con resultados en tiempo real y tabla de clasificación automática.

---

## ✅ Requisitos

- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) (gratis)
- [Node.js 18+](https://nodejs.org) instalado
- [Git](https://git-scm.com) instalado

---

## 🚀 Paso 1 — Crear la base de datos en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**
2. Ponle un nombre (ej. `quiniela-mundial`) y una contraseña
3. Espera ~1 minuto a que se cree
4. Ve a **SQL Editor** → **New query**
5. Copia y pega TODO el contenido de `supabase-schema.sql`
6. Presiona **Run** → debe decir "Success"

Anota estas dos cosas (están en **Settings → API**):
- **Project URL**: `https://xxxxxxxx.supabase.co`
- **anon/public key**: `eyJhbGci...`

---

## 🚀 Paso 2 — Subir el código a GitHub

```bash
# En la carpeta del proyecto:
git init
git add .
git commit -m "Quiniela Mundial 2026"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/quiniela-mundial.git
git push -u origin main
```

---

## 🚀 Paso 3 — Publicar en Vercel

1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Importa tu repositorio de GitHub
3. En **Environment Variables** agrega:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (tu anon key) |
| `VITE_ADMIN_PASSWORD` | Una contraseña que tú elijas |

4. Presiona **Deploy** → en ~1 minuto estará en vivo

Tu app quedará en: `https://quiniela-mundial.vercel.app`

---

## 🎮 Cómo usar

### Como administrador

1. Ve a `tuapp.vercel.app/admin`
2. Ingresa tu contraseña
3. **Jugadores** → Agrega a cada amigo y copia su link único
4. **Partidos** → Presiona "⚡ Cargar partidos base" para cargar los 39 partidos de fase de grupos automáticamente
5. **Resultados** → Ingresa los marcadores conforme vayan jugando

### Como jugador

1. Abre el link que te pasó el admin (ej. `tuapp.vercel.app/jugador/carlos-abc123`)
2. Llena tus predicciones
3. Presiona **Guardar**
4. Ve a la pestaña **En vivo** para ver cómo vas
5. Ve a **Tabla** para ver la clasificación

---

## 🏅 Sistema de puntos

| Resultado | Puntos |
|-----------|--------|
| Marcador exacto (ej. predijiste 2-1, fue 2-1) | **+3 pts** |
| Ganador correcto (predijiste 2-1, fue 3-1) | **+1 pt** |
| Empate correcto (predijiste 1-1, fue 0-0) | **+1 pt** |
| Incorrecto | **0 pts** |

Para cambiar la puntuación, edita `src/lib/config.js`.

---

## 📱 Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio (ingresa tu código) |
| `/jugador/:token` | Quiniela del jugador |
| `/tabla` | Tabla general pública |
| `/admin` | Panel de administrador |

---

## 🔧 Desarrollo local

```bash
npm install
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase
npm run dev
```

---

## ❓ Preguntas frecuentes

**¿Cuántos partidos cubre?**
La app viene con 39 partidos de fase de grupos precargados. Puedes agregar manualmente los partidos de eliminación directa (octavos, cuartos, semis, final) desde el panel admin.

**¿Los resultados son en tiempo real?**
Sí. Cuando ingresas un marcador en el admin, la tabla y el marcador de todos los jugadores se actualizan al instante via WebSockets (Supabase Realtime).

**¿Puedo agregar más de 10 jugadores?**
Sí, no hay límite. El plan gratuito de Supabase aguanta perfectamente hasta 500MB de datos.

**¿Qué pasa si un jugador no llena un partido?**
Simplemente no recibe puntos por ese partido.
