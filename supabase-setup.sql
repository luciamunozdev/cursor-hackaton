-- Script SQL para crear la tabla de resultados del quiz en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Crear la tabla quiz_results
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('fácil', 'medio', 'difícil')),
  total_time INTEGER NOT NULL, -- tiempo en segundos
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  score_percentage INTEGER NOT NULL CHECK (score_percentage >= 0 AND score_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_quiz_results_difficulty ON quiz_results(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_results_score ON quiz_results(score_percentage DESC, total_time ASC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública (todos pueden ver el leaderboard)
CREATE POLICY "Allow public read access" ON quiz_results
  FOR SELECT
  USING (true);

-- Crear política para permitir inserción pública (todos pueden guardar resultados)
CREATE POLICY "Allow public insert" ON quiz_results
  FOR INSERT
  WITH CHECK (true);

-- Opcional: Si quieres permitir que los usuarios actualicen solo sus propios resultados
-- CREATE POLICY "Allow users to update own results" ON quiz_results
--   FOR UPDATE
--   USING (true)
--   WITH CHECK (true);

-- Opcional: Si quieres permitir que los usuarios eliminen solo sus propios resultados
-- CREATE POLICY "Allow users to delete own results" ON quiz_results
--   FOR DELETE
--   USING (true);

