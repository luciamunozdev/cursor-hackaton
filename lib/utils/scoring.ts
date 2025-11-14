/**
 * Calcula los puntos basados en el tiempo de respuesta
 * @param answerTime Tiempo en segundos que tardó en responder
 * @param maxTime Tiempo máximo en segundos (por defecto 30)
 * @returns Puntos de 0 a 1000
 */
export function calculatePoints(answerTime: number, maxTime: number = 30): number {
  // Si el tiempo es mayor al máximo, no obtiene puntos
  if (answerTime >= maxTime) {
    return 0;
  }

  // Fórmula: puntos = 1000 * (1 - tiempo / tiempo_maximo)
  // Respuesta instantánea (0s) = 1000 puntos
  // Respuesta al límite (30s) = 0 puntos
  const points = Math.round(1000 * (1 - answerTime / maxTime));
  
  // Asegurar que los puntos estén entre 0 y 1000
  return Math.max(0, Math.min(1000, points));
}

/**
 * Calcula los puntos con una curva más suave (exponencial)
 * Da más puntos a respuestas rápidas y penaliza más las lentas
 * @param answerTime Tiempo en segundos que tardó en responder
 * @param maxTime Tiempo máximo en segundos (por defecto 30)
 * @returns Puntos de 0 a 1000
 */
export function calculatePointsExponential(answerTime: number, maxTime: number = 30): number {
  if (answerTime >= maxTime) {
    return 0;
  }

  // Usar una curva exponencial: puntos = 1000 * e^(-k * tiempo)
  // donde k se ajusta para que en maxTime los puntos sean ~0
  const k = 0.1; // Factor de decaimiento
  const points = Math.round(1000 * Math.exp(-k * answerTime));
  
  return Math.max(0, Math.min(1000, points));
}

