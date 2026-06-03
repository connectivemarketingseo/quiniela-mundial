import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Admin password (set via env var) ─────────────────────────────────────────
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026'

// ── Scoring rules ─────────────────────────────────────────────────────────────
export const PUNTOS_EXACTO   = 3   // marcador exacto
export const PUNTOS_GANADOR  = 1   // ganador/empate correcto

// ── All 48 qualified teams for FIFA World Cup 2026 ───────────────────────────
export const EQUIPOS = [
  // CONCACAF (hosts)
  { id: 'USA',  nombre: 'Estados Unidos', bandera: '🇺🇸', grupo: 'A', conf: 'CONCACAF' },
  { id: 'CAN',  nombre: 'Canadá',         bandera: '🇨🇦', grupo: 'A', conf: 'CONCACAF' },
  { id: 'MEX',  nombre: 'México',         bandera: '🇲🇽', grupo: 'B', conf: 'CONCACAF' },
  { id: 'CRC',  nombre: 'Costa Rica',     bandera: '🇨🇷', grupo: 'C', conf: 'CONCACAF' },
  { id: 'HON',  nombre: 'Honduras',       bandera: '🇭🇳', grupo: 'D', conf: 'CONCACAF' },
  { id: 'PAN',  nombre: 'Panamá',         bandera: '🇵🇦', grupo: 'E', conf: 'CONCACAF' },
  // CONMEBOL
  { id: 'ARG',  nombre: 'Argentina',      bandera: '🇦🇷', grupo: 'F', conf: 'CONMEBOL' },
  { id: 'BRA',  nombre: 'Brasil',         bandera: '🇧🇷', grupo: 'G', conf: 'CONMEBOL' },
  { id: 'URU',  nombre: 'Uruguay',        bandera: '🇺🇾', grupo: 'H', conf: 'CONMEBOL' },
  { id: 'COL',  nombre: 'Colombia',       bandera: '🇨🇴', grupo: 'A', conf: 'CONMEBOL' },
  { id: 'ECU',  nombre: 'Ecuador',        bandera: '🇪🇨', grupo: 'B', conf: 'CONMEBOL' },
  { id: 'PAR',  nombre: 'Paraguay',       bandera: '🇵🇾', grupo: 'C', conf: 'CONMEBOL' },
  { id: 'CHI',  nombre: 'Chile',          bandera: '🇨🇱', grupo: 'D', conf: 'CONMEBOL' },
  { id: 'BOL',  nombre: 'Bolivia',        bandera: '🇧🇴', grupo: 'E', conf: 'CONMEBOL' },
  { id: 'VEN',  nombre: 'Venezuela',      bandera: '🇻🇪', grupo: 'F', conf: 'CONMEBOL' },
  { id: 'PER',  nombre: 'Perú',           bandera: '🇵🇪', grupo: 'G', conf: 'CONMEBOL' },
  // UEFA
  { id: 'ESP',  nombre: 'España',         bandera: '🇪🇸', grupo: 'H', conf: 'UEFA' },
  { id: 'FRA',  nombre: 'Francia',        bandera: '🇫🇷', grupo: 'A', conf: 'UEFA' },
  { id: 'ENG',  nombre: 'Inglaterra',     bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', grupo: 'B', conf: 'UEFA' },
  { id: 'GER',  nombre: 'Alemania',       bandera: '🇩🇪', grupo: 'C', conf: 'UEFA' },
  { id: 'POR',  nombre: 'Portugal',       bandera: '🇵🇹', grupo: 'D', conf: 'UEFA' },
  { id: 'NED',  nombre: 'Países Bajos',   bandera: '🇳🇱', grupo: 'E', conf: 'UEFA' },
  { id: 'BEL',  nombre: 'Bélgica',        bandera: '🇧🇪', grupo: 'F', conf: 'UEFA' },
  { id: 'ITA',  nombre: 'Italia',         bandera: '🇮🇹', grupo: 'G', conf: 'UEFA' },
  { id: 'CRO',  nombre: 'Croacia',        bandera: '🇭🇷', grupo: 'H', conf: 'UEFA' },
  { id: 'SUI',  nombre: 'Suiza',          bandera: '🇨🇭', grupo: 'A', conf: 'UEFA' },
  { id: 'AUT',  nombre: 'Austria',        bandera: '🇦🇹', grupo: 'B', conf: 'UEFA' },
  { id: 'DEN',  nombre: 'Dinamarca',      bandera: '🇩🇰', grupo: 'C', conf: 'UEFA' },
  { id: 'SCO',  nombre: 'Escocia',        bandera: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', grupo: 'D', conf: 'UEFA' },
  { id: 'TUR',  nombre: 'Turquía',        bandera: '🇹🇷', grupo: 'E', conf: 'UEFA' },
  { id: 'UKR',  nombre: 'Ucrania',        bandera: '🇺🇦', grupo: 'F', conf: 'UEFA' },
  { id: 'SRB',  nombre: 'Serbia',         bandera: '🇷🇸', grupo: 'G', conf: 'UEFA' },
  { id: 'ROU',  nombre: 'Rumanía',        bandera: '🇷🇴', grupo: 'H', conf: 'UEFA' },
  { id: 'SVK',  nombre: 'Eslovaquia',     bandera: '🇸🇰', grupo: 'A', conf: 'UEFA' },
  { id: 'HUN',  nombre: 'Hungría',        bandera: '🇭🇺', grupo: 'B', conf: 'UEFA' },
  { id: 'GRE',  nombre: 'Grecia',         bandera: '🇬🇷', grupo: 'C', conf: 'UEFA' },
  { id: 'CZE',  nombre: 'Rep. Checa',     bandera: '🇨🇿', grupo: 'D', conf: 'UEFA' },
  // CAF
  { id: 'MAR',  nombre: 'Marruecos',      bandera: '🇲🇦', grupo: 'E', conf: 'CAF' },
  { id: 'SEN',  nombre: 'Senegal',        bandera: '🇸🇳', grupo: 'F', conf: 'CAF' },
  { id: 'EGY',  nombre: 'Egipto',         bandera: '🇪🇬', grupo: 'G', conf: 'CAF' },
  { id: 'NGA',  nombre: 'Nigeria',        bandera: '🇳🇬', grupo: 'H', conf: 'CAF' },
  { id: 'CMR',  nombre: 'Camerún',        bandera: '🇨🇲', grupo: 'A', conf: 'CAF' },
  { id: 'CIV',  nombre: "Costa de Marfil",bandera: '🇨🇮', grupo: 'B', conf: 'CAF' },
  { id: 'GHA',  nombre: 'Ghana',          bandera: '🇬🇭', grupo: 'C', conf: 'CAF' },
  { id: 'TUN',  nombre: 'Túnez',          bandera: '🇹🇳', grupo: 'D', conf: 'CAF' },
  // AFC
  { id: 'JPN',  nombre: 'Japón',          bandera: '🇯🇵', grupo: 'E', conf: 'AFC' },
  { id: 'KOR',  nombre: 'Corea del Sur',  bandera: '🇰🇷', grupo: 'F', conf: 'AFC' },
  { id: 'AUS',  nombre: 'Australia',      bandera: '🇦🇺', grupo: 'G', conf: 'AFC' },
  { id: 'IRN',  nombre: 'Irán',           bandera: '🇮🇷', grupo: 'H', conf: 'AFC' },
]

// ── Fase de grupos: 48 partidos (first 48 of the 104 matches) ─────────────────
// Subset for display — admin adds all matches in the panel
export const PARTIDOS_GRUPOS = [
  { id: 1,  fase: 'Grupo A', local: 'MEX', visitante: 'USA', fecha: '2026-06-11', hora: '20:00', estadio: 'Estadio Azteca, CDMX' },
  { id: 2,  fase: 'Grupo A', local: 'COL', visitante: 'FRA', fecha: '2026-06-11', hora: '23:00', estadio: 'MetLife Stadium, NJ' },
  { id: 3,  fase: 'Grupo A', local: 'CMR', visitante: 'SUI', fecha: '2026-06-12', hora: '18:00', estadio: 'Levi\'s Stadium, SF' },
  { id: 4,  fase: 'Grupo A', local: 'SVK', visitante: 'USA', fecha: '2026-06-15', hora: '20:00', estadio: 'SoFi Stadium, LA' },
  { id: 5,  fase: 'Grupo A', local: 'MEX', visitante: 'FRA', fecha: '2026-06-16', hora: '23:00', estadio: 'AT&T Stadium, Dallas' },
  { id: 6,  fase: 'Grupo A', local: 'COL', visitante: 'SUI', fecha: '2026-06-17', hora: '18:00', estadio: 'Arrowhead, KC' },
  { id: 7,  fase: 'Grupo A', local: 'CMR', visitante: 'SVK', fecha: '2026-06-18', hora: '20:00', estadio: 'Lumen Field, Seattle' },
  { id: 8,  fase: 'Grupo A', local: 'MEX', visitante: 'COL', fecha: '2026-06-20', hora: '20:00', estadio: 'Rose Bowl, LA' },
  { id: 9,  fase: 'Grupo A', local: 'USA', visitante: 'FRA', fecha: '2026-06-20', hora: '20:00', estadio: 'MetLife, NJ' },
  { id: 10, fase: 'Grupo A', local: 'SUI', visitante: 'SVK', fecha: '2026-06-21', hora: '20:00', estadio: 'Gillette, Boston' },
  { id: 11, fase: 'Grupo A', local: 'CMR', visitante: 'USA', fecha: '2026-06-21', hora: '20:00', estadio: 'BC Place, Vancouver' },
  { id: 12, fase: 'Grupo B', local: 'CAN', visitante: 'ECU', fecha: '2026-06-12', hora: '20:00', estadio: 'BC Place, Vancouver' },
  { id: 13, fase: 'Grupo B', local: 'ENG', visitante: 'AUT', fecha: '2026-06-12', hora: '23:00', estadio: 'MetLife, NJ' },
  { id: 14, fase: 'Grupo B', local: 'MEX', visitante: 'HUN', fecha: '2026-06-13', hora: '18:00', estadio: 'AT&T Stadium' },
  { id: 15, fase: 'Grupo B', local: 'CAN', visitante: 'AUT', fecha: '2026-06-16', hora: '20:00', estadio: 'SoFi, LA' },
  { id: 16, fase: 'Grupo B', local: 'ENG', visitante: 'ECU', fecha: '2026-06-17', hora: '23:00', estadio: 'Lumen, Seattle' },
  { id: 17, fase: 'Grupo B', local: 'HUN', visitante: 'CIV', fecha: '2026-06-18', hora: '18:00', estadio: 'Rose Bowl, LA' },
  { id: 18, fase: 'Grupo B', local: 'CAN', visitante: 'HUN', fecha: '2026-06-21', hora: '20:00', estadio: 'AT&T Stadium' },
  { id: 19, fase: 'Grupo B', local: 'ECU', visitante: 'AUT', fecha: '2026-06-21', hora: '20:00', estadio: 'Arrowhead, KC' },
  { id: 20, fase: 'Grupo B', local: 'ENG', visitante: 'CIV', fecha: '2026-06-22', hora: '20:00', estadio: 'MetLife, NJ' },
  { id: 21, fase: 'Grupo C', local: 'GER', visitante: 'GHA', fecha: '2026-06-13', hora: '20:00', estadio: 'MetLife, NJ' },
  { id: 22, fase: 'Grupo C', local: 'DEN', visitante: 'PAR', fecha: '2026-06-13', hora: '23:00', estadio: 'SoFi, LA' },
  { id: 23, fase: 'Grupo C', local: 'GRE', visitante: 'CRC', fecha: '2026-06-14', hora: '18:00', estadio: 'AT&T' },
  { id: 24, fase: 'Grupo C', local: 'GER', visitante: 'DEN', fecha: '2026-06-17', hora: '20:00', estadio: 'Gillette, Boston' },
  { id: 25, fase: 'Grupo D', local: 'POR', visitante: 'CHI', fecha: '2026-06-14', hora: '20:00', estadio: 'SoFi, LA' },
  { id: 26, fase: 'Grupo D', local: 'SCO', visitante: 'HON', fecha: '2026-06-14', hora: '23:00', estadio: 'BC Place' },
  { id: 27, fase: 'Grupo D', local: 'TUN', visitante: 'CZE', fecha: '2026-06-15', hora: '18:00', estadio: 'MetLife, NJ' },
  { id: 28, fase: 'Grupo E', local: 'NED', visitante: 'TUR', fecha: '2026-06-15', hora: '20:00', estadio: 'Rose Bowl, LA' },
  { id: 29, fase: 'Grupo E', local: 'JPN', visitante: 'MAR', fecha: '2026-06-15', hora: '23:00', estadio: 'Gillette, Boston' },
  { id: 30, fase: 'Grupo E', local: 'PAN', visitante: 'BOL', fecha: '2026-06-16', hora: '18:00', estadio: 'Levi\'s, SF' },
  { id: 31, fase: 'Grupo F', local: 'ARG', visitante: 'VEN', fecha: '2026-06-16', hora: '23:00', estadio: 'MetLife, NJ' },
  { id: 32, fase: 'Grupo F', local: 'BEL', visitante: 'SEN', fecha: '2026-06-17', hora: '18:00', estadio: 'AT&T, Dallas' },
  { id: 33, fase: 'Grupo F', local: 'UKR', visitante: 'KOR', fecha: '2026-06-18', hora: '20:00', estadio: 'Lumen, Seattle' },
  { id: 34, fase: 'Grupo G', local: 'BRA', visitante: 'SRB', fecha: '2026-06-18', hora: '23:00', estadio: 'SoFi, LA' },
  { id: 35, fase: 'Grupo G', local: 'ITA', visitante: 'EGY', fecha: '2026-06-19', hora: '18:00', estadio: 'Rose Bowl, LA' },
  { id: 36, fase: 'Grupo G', local: 'AUS', visitante: 'PER', fecha: '2026-06-19', hora: '20:00', estadio: 'AT&T, Dallas' },
  { id: 37, fase: 'Grupo H', local: 'ESP', visitante: 'ROU', fecha: '2026-06-19', hora: '23:00', estadio: 'MetLife, NJ' },
  { id: 38, fase: 'Grupo H', local: 'CRO', visitante: 'NGA', fecha: '2026-06-20', hora: '18:00', estadio: 'Gillette, Boston' },
  { id: 39, fase: 'Grupo H', local: 'URU', visitante: 'IRN', fecha: '2026-06-20', hora: '23:00', estadio: 'Levi\'s, SF' },
]
