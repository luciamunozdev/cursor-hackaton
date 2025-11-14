import { supabase } from './client';
import type { QuizResult, LeaderboardEntry } from './types';

/**
 * Guarda un resultado del quiz en la base de datos
 */
export async function saveQuizResult(result: QuizResult): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase
    .from('quiz_results')
    .insert([result])
    .select()
    .single();

  return { data, error };
}

/**
 * Obtiene el leaderboard ordenado por porcentaje de aciertos (desc) y tiempo (asc)
 */
export async function getLeaderboard(
  difficulty?: 'fácil' | 'medio' | 'difícil',
  limit: number = 50
): Promise<{ data: LeaderboardEntry[] | null; error: any }> {
  let query = supabase
    .from('quiz_results')
    .select('*')
    .order('score_percentage', { ascending: false })
    .order('total_time', { ascending: true })
    .limit(limit);

  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }

  const { data, error } = await query;

  // Agregar ranking
  const rankedData = data?.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  })) || null;

  return { data: rankedData, error };
}

/**
 * Obtiene las mejores puntuaciones de un jugador
 */
export async function getPlayerBestScores(
  playerName: string
): Promise<{ data: LeaderboardEntry[] | null; error: any }> {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('player_name', playerName)
    .order('score_percentage', { ascending: false })
    .order('total_time', { ascending: true })
    .limit(10);

  return { data, error };
}

