import { PUNTOS_EXACTO, PUNTOS_GANADOR } from './config'

/**
 * Calculate points for a single prediction vs actual result.
 * Returns { puntos, tipo: 'exacto' | 'ganador' | 'empate' | null }
 */
export function calcularPuntos(predLocal, predVisitante, realLocal, realVisitante) {
  if (realLocal == null || realVisitante == null) return { puntos: 0, tipo: null }

  const pL = parseInt(predLocal)
  const pV = parseInt(predVisitante)
  const rL = parseInt(realLocal)
  const rV = parseInt(realVisitante)

  if (isNaN(pL) || isNaN(pV)) return { puntos: 0, tipo: null }

  if (pL === rL && pV === rV) return { puntos: PUNTOS_EXACTO, tipo: 'exacto' }

  const ganadorPred = pL > pV ? 'local' : pL < pV ? 'visitante' : 'empate'
  const ganadorReal = rL > rV ? 'local' : rL < rV ? 'visitante' : 'empate'

  if (ganadorPred === ganadorReal) {
    return { puntos: PUNTOS_GANADOR, tipo: ganadorPred === 'empate' ? 'empate' : 'ganador' }
  }

  return { puntos: 0, tipo: null }
}

/**
 * Calculate total points for a player given their predictions and real results.
 */
export function calcularTotalPuntos(predicciones, resultados) {
  let total = 0
  for (const pred of predicciones) {
    const real = resultados.find(r => r.partido_id === pred.partido_id)
    if (!real) continue
    const { puntos } = calcularPuntos(
      pred.goles_local,
      pred.goles_visitante,
      real.goles_local,
      real.goles_visitante
    )
    total += puntos
  }
  return total
}
