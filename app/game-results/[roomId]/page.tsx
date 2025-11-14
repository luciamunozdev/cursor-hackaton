"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { getRoomById, getRoomParticipants } from "@/lib/supabase/rooms";
import type { GameRoom, RoomParticipant } from "@/lib/supabase/rooms";
import Image from "next/image";

export default function GameResultsPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<GameRoom | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);

  useEffect(() => {
    if (roomId) {
      loadData();
    }
  }, [roomId]);

  const loadData = async () => {
    const { data: roomData, error: roomError } = await getRoomById(roomId);
    
    if (roomError || !roomData) {
      router.push("/");
      return;
    }

    setRoom(roomData);

    const { data: participantsData, error: participantsError } = await getRoomParticipants(roomId);
    
    if (!participantsError && participantsData) {
      // Ordenar por score y tomar solo los top 5
      const sorted = participantsData.sort((a, b) => b.score - a.score);
      setParticipants(sorted.slice(0, 5));
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-8 w-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-8 w-8 text-gray-400" />;
    if (rank === 3) return <Award className="h-8 w-8 text-amber-600" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700";
    if (rank === 2) return "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700";
    if (rank === 3) return "bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700";
    return "";
  };

  if (!room || participants.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando resultados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl">¡Juego Finalizado!</CardTitle>
            <p className="text-muted-foreground mt-2">Sala: {room.room_code}</p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Top 5 Clasificación Final</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participants.length === 0 ? (
                <p className="text-center text-muted-foreground">No hay participantes</p>
              ) : (
                participants.map((participant, index) => {
                const rank = index + 1;
                return (
                  <Card
                    key={participant.id}
                    className={`transition-all ${
                      rank <= 3 ? getRankColor(rank) : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 flex-shrink-0">
                          {rank <= 3 ? (
                            getRankIcon(rank)
                          ) : (
                            <span className="text-2xl font-bold text-muted-foreground">
                              #{rank}
                            </span>
                          )}
                        </div>
                        <Image
                          src={participant.avatar_url}
                          alt={participant.player_name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-xl font-bold">{participant.player_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {participant.score} puntos totales
                          </p>
                        </div>
                        <Badge className="text-lg px-4 py-2">
                          {participant.score} pts
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              }))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.push("/admin")}
            size="lg"
            variant="outline"
          >
            Crear Nueva Sala
          </Button>
          <Button
            onClick={() => router.push("/")}
            size="lg"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}

