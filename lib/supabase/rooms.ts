import { supabase } from './client';
import type { Difficulty } from '@/lib/quiz-data';
import { shuffleQuestions } from '@/lib/quiz-data';
import { quizData } from '@/lib/quiz-data';

export interface GameRoom {
  id: string;
  room_code: string;
  difficulty: Difficulty;
  max_players: number;
  status: 'waiting' | 'starting' | 'in_progress' | 'finished';
  current_question_index: number;
  started_at: string | null;
  created_at: string;
  created_by: string | null;
  language: 'es' | 'en';
  question_order: number[] | null; // Array de IDs de preguntas en orden aleatorio
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  player_name: string;
  avatar_url: string;
  score: number;
  current_answer: number | null;
  answer_time: number | null;
  joined_at: string;
}

/**
 * Crea una nueva sala de juego
 */
export async function createGameRoom(
  difficulty: Difficulty,
  maxPlayers: number,
  createdBy: string,
  language: 'es' | 'en' = 'es'
): Promise<{ data: GameRoom | null; error: any }> {
  // Generar código de sala único
  let roomCode = '';
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    roomCode = generateRoomCode();
    const { data } = await supabase
      .from('game_rooms')
      .select('id')
      .eq('room_code', roomCode)
      .single();

    if (!data) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    return { data: null, error: { message: 'No se pudo generar un código único' } };
  }

  // Aleatorizar el orden de las preguntas
  const questions = quizData[difficulty];
  const shuffled = shuffleQuestions(questions);
  const questionOrder = shuffled.map(q => q.id);

  const { data, error } = await supabase
    .from('game_rooms')
    .insert([
      {
        room_code: roomCode,
        difficulty,
        max_players: maxPlayers,
        status: 'waiting',
        created_by: createdBy,
        language,
        question_order: questionOrder,
      },
    ])
    .select()
    .single();

  return { data, error };
}

/**
 * Obtiene una sala por su código
 */
export async function getRoomByCode(
  roomCode: string
): Promise<{ data: GameRoom | null; error: any }> {
  const { data, error } = await supabase
    .from('game_rooms')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .single();

  return { data, error };
}

/**
 * Obtiene una sala por su ID
 */
export async function getRoomById(
  roomId: string
): Promise<{ data: GameRoom | null; error: any }> {
  const { data, error } = await supabase
    .from('game_rooms')
    .select('*')
    .eq('id', roomId)
    .single();

  return { data, error };
}

/**
 * Actualiza el estado de una sala
 */
export async function updateRoomStatus(
  roomId: string,
  status: GameRoom['status'],
  questionIndex?: number
): Promise<{ data: any; error: any }> {
  const updateData: any = { status };
  
  if (status === 'in_progress' && questionIndex !== undefined) {
    updateData.current_question_index = questionIndex;
  }
  
  if (status === 'in_progress' && !updateData.started_at) {
    updateData.started_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('game_rooms')
    .update(updateData)
    .eq('id', roomId)
    .select()
    .single();

  return { data, error };
}

/**
 * Añade un participante a una sala
 */
export async function addParticipant(
  roomId: string,
  playerName: string,
  avatarUrl: string
): Promise<{ data: RoomParticipant | null; error: any }> {
  // Verificar que la sala existe y tiene espacio
  const { data: room, error: roomError } = await getRoomById(roomId);
  
  if (roomError || !room) {
    return { data: null, error: { message: 'Sala no encontrada' } };
  }

  if (room.status !== 'waiting') {
    return { data: null, error: { message: 'La sala ya ha comenzado' } };
  }

  // Contar participantes actuales
  const { count } = await supabase
    .from('room_participants')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', roomId);

  if (count !== null && count >= room.max_players) {
    return { data: null, error: { message: 'La sala está llena' } };
  }

  // Verificar que el nombre no esté en uso
  const { data: existing } = await supabase
    .from('room_participants')
    .select('id')
    .eq('room_id', roomId)
    .eq('player_name', playerName)
    .single();

  if (existing) {
    return { data: null, error: { message: 'Este nombre ya está en uso' } };
  }

  // Añadir participante
  const { data, error } = await supabase
    .from('room_participants')
    .insert([
      {
        room_id: roomId,
        player_name: playerName,
        avatar_url: avatarUrl,
        score: 0,
      },
    ])
    .select()
    .single();

  return { data, error };
}

/**
 * Obtiene todos los participantes de una sala
 */
export async function getRoomParticipants(
  roomId: string
): Promise<{ data: RoomParticipant[] | null; error: any }> {
  const { data, error } = await supabase
    .from('room_participants')
    .select('*')
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true });

  return { data, error };
}

/**
 * Actualiza la respuesta de un participante
 */
export async function updateParticipantAnswer(
  participantId: string,
  answer: number,
  answerTime: number
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase
    .from('room_participants')
    .update({
      current_answer: answer,
      answer_time: answerTime,
    })
    .eq('id', participantId)
    .select()
    .single();

  return { data, error };
}

/**
 * Guarda la respuesta de un participante
 */
export async function saveParticipantAnswer(
  participantId: string,
  roomId: string,
  questionIndex: number,
  selectedAnswer: number,
  isCorrect: boolean,
  answerTime: number,
  points: number
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase
    .from('participant_answers')
    .insert([
      {
        participant_id: participantId,
        room_id: roomId,
        question_index: questionIndex,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        answer_time: answerTime,
      },
    ])
    .select()
    .single();

  // Actualizar score del participante con los puntos obtenidos
  if (isCorrect) {
    // Obtener score actual y sumar los puntos
    const { data: participant } = await supabase
      .from('room_participants')
      .select('score')
      .eq('id', participantId)
      .single();
    
    if (participant) {
      await supabase
        .from('room_participants')
        .update({ score: participant.score + points })
        .eq('id', participantId);
    }
  }

  return { data, error };
}

/**
 * Genera un código de sala aleatorio
 */
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

