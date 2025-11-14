"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getRoomById, updateRoomStatus, getRoomParticipants, updateParticipantAnswer, saveParticipantAnswer } from "@/lib/supabase/rooms";
import { supabase } from "@/lib/supabase/client";
import { quizData, type Difficulty, getQuestionText, getQuestionOptions, getOptionOrder } from "@/lib/quiz-data";
import { calculatePoints } from "@/lib/utils/scoring";
import type { GameRoom, RoomParticipant } from "@/lib/supabase/rooms";
import { toast } from "sonner";
import Image from "next/image";

export default function GameRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = useRef<string | null>(null);
  const participantId = useRef<string | null>(null);
  
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const pathRoomId = window.location.pathname.split('/').pop();
    roomId.current = pathRoomId || null;
    participantId.current = searchParams.get('participant');

    if (roomId.current) {
      loadRoom();
    }
  }, []);

  useEffect(() => {
    if (roomId.current) {
      const unsubscribe = subscribeToRoom();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [roomId.current]);

  const loadRoom = async () => {
    if (!roomId.current) return;

    const { data, error } = await getRoomById(roomId.current);
    
    if (error || !data) {
      toast.error("Sala no encontrada");
      router.push("/");
      return;
    }

    setRoom(data);
    // El admin es quien creó la sala (no tiene participantId)
    const adminName = data.created_by;
    setIsAdmin(!!adminName && !participantId.current);
    
    if (data.status === 'in_progress') {
      setCurrentQuestionIndex(data.current_question_index);
      setQuestionStartTime(Date.now());
    }

    loadParticipants();
  };

  const loadParticipants = async () => {
    if (!roomId.current) return;

    const { data, error } = await getRoomParticipants(roomId.current);
    
    if (!error && data) {
      setParticipants(data);
    }
  };

  const subscribeToRoom = () => {
    if (!roomId.current) return;

    const channel = supabase
      .channel(`game-room:${roomId.current}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_rooms',
        filter: `id=eq.${roomId.current}`,
      }, (payload) => {
        const updatedRoom = payload.new as GameRoom;
        setRoom(updatedRoom);
        
        // Si el juego terminó, redirigir a resultados
        if (updatedRoom.status === 'finished') {
          router.push(`/game-results/${roomId.current}`);
          return;
        }
        
        if (updatedRoom.status === 'in_progress' && updatedRoom.current_question_index !== currentQuestionIndex) {
          handleNewQuestion(updatedRoom.current_question_index);
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId.current}`,
      }, () => {
        loadParticipants();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const handleNewQuestion = async (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowResults(false);
    setQuestionStartTime(Date.now());
    
    // Limpiar respuestas actuales de todos los participantes
    if (roomId.current) {
      await supabase
        .from('room_participants')
        .update({ current_answer: null, answer_time: null })
        .eq('room_id', roomId.current);
    }
  };

  const handleStartGame = async () => {
    if (!roomId.current) return;

    const { error } = await updateRoomStatus(roomId.current, 'in_progress', 0);
    
    if (error) {
      toast.error("No se pudo iniciar el juego");
      return;
    }

    setQuestionStartTime(Date.now());
    toast.success("¡El juego ha comenzado!");
  };

  const handleAnswerSelect = (value: string) => {
    if (hasAnswered) return;
    
    const answerIndex = parseInt(value);
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (!room || !participantId.current || selectedAnswer === null || hasAnswered) return;

    const answerTime = Math.floor((Date.now() - questionStartTime) / 1000);
    setHasAnswered(true);

    // Obtener pregunta actual usando el orden aleatorio y el idioma
    const allQuestions = quizData[room.difficulty];
    const questionOrder = room.question_order || allQuestions.map(q => q.id);
    const currentQuestionId = questionOrder[currentQuestionIndex];
    const currentQuestion = allQuestions.find(q => q.id === currentQuestionId);
    
    if (!currentQuestion) return;
    
    const optionOrder = getOptionOrder(currentQuestion.id, room.room_code);
    const selectedActualIndex = optionOrder[selectedAnswer];
    const isCorrect = selectedActualIndex === currentQuestion.correctIndex;

    // Actualizar respuesta del participante con el índice real
    await updateParticipantAnswer(participantId.current, selectedActualIndex, answerTime);

    // Calcular puntos basados en el tiempo (solo si es correcta)
    const points = isCorrect ? calculatePoints(answerTime) : 0;

    await saveParticipantAnswer(
      participantId.current,
      room.id,
      currentQuestionIndex,
      selectedActualIndex,
      isCorrect,
      answerTime,
      points
    );

    const language = room.language || 'es';
    if (isCorrect) {
      toast.success(language === 'es' ? `¡Correcto! +${points} puntos` : `Correct! +${points} points`);
    } else {
      toast.error(language === 'es' ? "Incorrecto" : "Incorrect");
    }
  };

  const handleNextQuestion = async () => {
    if (!roomId.current || !room) return;

    const allQuestions = quizData[room.difficulty];
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= allQuestions.length) {
      // Fin del juego
      await updateRoomStatus(roomId.current, 'finished');
      router.push(`/game-results/${roomId.current}`);
    } else {
      await updateRoomStatus(roomId.current, 'in_progress', nextIndex);
    }
  };

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando sala...</p>
      </div>
    );
  }

  // Obtener preguntas ordenadas y pregunta actual
  const allQuestions = quizData[room.difficulty];
  const questionOrder = room.question_order || allQuestions.map(q => q.id);
  const currentQuestionId = questionOrder[currentQuestionIndex];
  const currentQuestion = allQuestions.find(q => q.id === currentQuestionId);
  const language = room.language || 'es';
  
  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando pregunta...</p>
      </div>
    );
  }
  
  const questionText = getQuestionText(currentQuestion, language);
  const baseOptions = getQuestionOptions(currentQuestion, language);
  const optionOrder = getOptionOrder(currentQuestion.id, room.room_code);
  const orderedOptions = optionOrder.map((index) => baseOptions[index]);
  const displayCorrectIndex = optionOrder.indexOf(currentQuestion.correctIndex);
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case "fácil":
        return "bg-green-500";
      case "medio":
        return "bg-yellow-500";
      case "difícil":
        return "bg-red-500";
    }
  };

  // Pantalla de espera
  if (room.status === 'waiting') {
    const waitingLanguage = room.language || 'es';
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">Sala: {room.room_code}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-4">
                <p className="text-base sm:text-lg">
                  {waitingLanguage === 'es' ? 'Jugadores' : 'Players'}: {participants.length} / {room.max_players}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                  {participants.map((p) => (
                    <div key={p.id} className="flex flex-col items-center p-2 sm:p-3 rounded-lg border">
                      <Image
                        src={p.avatar_url}
                        alt={p.player_name}
                        width={50}
                        height={50}
                        className="rounded-full mb-1 sm:mb-2"
                      />
                      <p className="text-xs sm:text-sm font-medium text-center truncate w-full">{p.player_name}</p>
                      {p.id === participantId.current && (
                        <Badge className="mt-1 text-xs">{waitingLanguage === 'es' ? 'Tú' : 'You'}</Badge>
                      )}
                    </div>
                  ))}
                </div>
                {isAdmin && (
                  <Button
                    onClick={handleStartGame}
                    size="lg"
                    className="w-full"
                    disabled={participants.length < 2}
                  >
                    {waitingLanguage === 'es' ? 'Iniciar Juego' : 'Start Game'}
                  </Button>
                )}
                {!isAdmin && (
                  <p className="text-center text-muted-foreground text-sm sm:text-base">
                    {waitingLanguage === 'es' 
                      ? 'Esperando a que el administrador inicie el juego...'
                      : 'Waiting for the administrator to start the game...'
                    }
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Vista del Admin (solo control, no juega)
  if (isAdmin) {
    const answeredCount = participants.filter(p => p.current_answer !== null).length;
    const allAnswered = answeredCount === participants.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <CardTitle className="text-lg sm:text-xl">Sala: {room.room_code} (Admin)</CardTitle>
                    <Badge className={getDifficultyColor(room.difficulty)}>
                      {room.difficulty.charAt(0).toUpperCase() + room.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {language === 'es' ? 'Pregunta' : 'Question'} {currentQuestionIndex + 1} {language === 'es' ? 'de' : 'of'} {allQuestions.length}
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(progress)}% {language === 'es' ? 'completado' : 'completed'}</span>
                    <span>{answeredCount} / {participants.length} {language === 'es' ? 'han respondido' : 'answered'}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Question Card (Admin View) */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-lg sm:text-xl md:text-2xl break-words">
                {questionText}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                {orderedOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 sm:p-4 rounded-md border ${
                      allAnswered && displayCorrectIndex === index
                        ? "bg-green-100 border-green-500 dark:bg-green-900/20"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="font-semibold text-muted-foreground min-w-[20px] sm:min-w-[24px] text-sm sm:text-base">
                        {index + 1}.
                      </span>
                      <span className="flex-1 text-sm sm:text-base break-words">{option}</span>
                      {allAnswered && displayCorrectIndex === index && (
                        <Badge className="bg-green-500 text-xs sm:text-sm whitespace-nowrap">
                          {language === 'es' ? 'Correcta' : 'Correct'}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleNextQuestion}
                size="lg"
                className="w-full"
                disabled={!allAnswered && participants.length > 0}
              >
                {isLastQuestion 
                  ? (language === 'es' ? "Ver Resultados Finales" : "View Final Results")
                  : (language === 'es' ? "Siguiente Pregunta" : "Next Question")
                }
              </Button>
              {!allAnswered && participants.length > 0 && (
                <p className="text-sm text-center text-muted-foreground">
                  {language === 'es' 
                    ? `Esperando a que todos respondan (${answeredCount}/${participants.length})`
                    : `Waiting for everyone to answer (${answeredCount}/${participants.length})`
                  }
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Vista del Jugador (puede responder)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <div className="flex flex-col gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <CardTitle className="text-lg sm:text-xl">Sala: {room.room_code}</CardTitle>
                  <Badge className={getDifficultyColor(room.difficulty)}>
                    {room.difficulty.charAt(0).toUpperCase() + room.difficulty.slice(1)}
                  </Badge>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {language === 'es' ? 'Pregunta' : 'Question'} {currentQuestionIndex + 1} {language === 'es' ? 'de' : 'of'} {allQuestions.length}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progress)}% {language === 'es' ? 'completado' : 'completed'}</span>
                  <span>{participants.length} {language === 'es' ? 'jugadores' : 'players'}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl break-words">
              {questionText}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            <RadioGroup
              value={selectedAnswer?.toString() ?? ""}
              onValueChange={handleAnswerSelect}
              className="space-y-2 sm:space-y-3"
              disabled={hasAnswered}
            >
              {orderedOptions.map((option, index) => (
                <div key={index} className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="mt-1 sm:mt-0 flex-shrink-0"
                    disabled={hasAnswered}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className={`flex-1 cursor-pointer rounded-md border p-3 sm:p-4 transition-colors ${
                      hasAnswered
                        ? (() => {
                            const allAnswered = participants.filter(p => p.current_answer !== null).length === participants.length;
                            if (!allAnswered) {
                              return selectedAnswer === index ? "bg-blue-100 border-blue-500" : "";
                            }
                            return selectedAnswer === index
                              ? displayCorrectIndex === index
                                ? "bg-green-100 border-green-500"
                                : "bg-red-100 border-red-500"
                              : displayCorrectIndex === index
                              ? "bg-green-100 border-green-500"
                              : "";
                          })()
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="font-semibold text-muted-foreground min-w-[20px] sm:min-w-[24px] text-sm sm:text-base">
                        {index + 1}.
                      </span>
                      <span className="flex-1 text-sm sm:text-base break-words">{option}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {!hasAnswered && selectedAnswer !== null && (
              <Button
                onClick={handleSubmitAnswer}
                size="lg"
                className="w-full"
              >
                {language === 'es' ? "Enviar Respuesta" : "Submit Answer"}
              </Button>
            )}

            {hasAnswered && (
              <p className="text-center text-muted-foreground">
                {language === 'es' ? "Esperando a que todos respondan..." : "Waiting for everyone to answer..."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

