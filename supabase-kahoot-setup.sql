-- Script SQL para crear las tablas necesarias para el sistema tipo Kahoot
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Tabla de salas (rooms)
CREATE TABLE IF NOT EXISTS game_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT UNIQUE NOT NULL, -- Código único de la sala (ej: ABC123)
  difficulty TEXT NOT NULL CHECK (difficulty IN ('fácil', 'medio', 'difícil')),
  max_players INTEGER NOT NULL CHECK (max_players > 0 AND max_players <= 20),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'starting', 'in_progress', 'finished')),
  current_question_index INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT -- Nombre del admin que creó la sala
);

-- Tabla de participantes
CREATE TABLE IF NOT EXISTS room_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  current_answer INTEGER, -- Respuesta actual a la pregunta
  answer_time INTEGER, -- Tiempo en segundos que tardó en responder
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, player_name)
);

-- Tabla de respuestas de los participantes
CREATE TABLE IF NOT EXISTS participant_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES room_participants(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answer_time INTEGER NOT NULL, -- Tiempo en segundos
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_game_rooms_room_code ON game_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_participant_answers_room_id ON participant_answers(room_id);
CREATE INDEX IF NOT EXISTS idx_participant_answers_participant_id ON participant_answers(participant_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_answers ENABLE ROW LEVEL SECURITY;

-- Políticas para game_rooms
CREATE POLICY "Allow public read access to rooms" ON game_rooms
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert for rooms" ON game_rooms
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update for rooms" ON game_rooms
  FOR UPDATE
  USING (true);

-- Políticas para room_participants
CREATE POLICY "Allow public read access to participants" ON room_participants
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert for participants" ON room_participants
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update for participants" ON room_participants
  FOR UPDATE
  USING (true);

-- Políticas para participant_answers
CREATE POLICY "Allow public read access to answers" ON participant_answers
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert for answers" ON participant_answers
  FOR INSERT
  WITH CHECK (true);

-- Función para generar códigos de sala únicos
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

