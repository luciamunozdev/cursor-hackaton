export interface QuizResult {
  id?: string;
  player_name: string;
  difficulty: 'fácil' | 'medio' | 'difícil';
  total_time: number; // en segundos
  correct_answers: number;
  total_questions: number;
  score_percentage: number;
  created_at?: string;
}

export interface LeaderboardEntry extends QuizResult {
  rank?: number;
}

