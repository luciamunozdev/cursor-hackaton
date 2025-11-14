-- Script SQL para actualizar la tabla game_rooms con las nuevas columnas
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase si ya tienes la tabla creada

-- Añadir columna de idioma
ALTER TABLE game_rooms 
ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en'));

-- Añadir columna de orden de preguntas
ALTER TABLE game_rooms 
ADD COLUMN IF NOT EXISTS question_order INTEGER[];

