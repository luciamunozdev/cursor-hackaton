"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getRoomByCode, addParticipant, getRoomParticipants } from "@/lib/supabase/rooms";
import { generateAvatarForName } from "@/lib/utils/avatar";
import type { GameRoom, RoomParticipant } from "@/lib/supabase/rooms";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

export default function JoinRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomCode = params.code as string;
  
  const [playerName, setPlayerName] = useState("");
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (roomCode) {
      loadRoom();
    }
  }, [roomCode]);

  useEffect(() => {
    if (room?.id) {
      // Suscribirse a cambios en participantes
      const channel = supabase
        .channel(`room:${room.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'room_participants',
          filter: `room_id=eq.${room.id}`,
        }, () => {
          loadParticipants();
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${room.id}`,
        }, (payload) => {
          const updatedRoom = payload.new as GameRoom;
          if (updatedRoom.status !== 'waiting') {
            router.push(`/game-room/${room.id}?participant=${participantId}`);
          }
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [room?.id, participantId]);

  const loadRoom = async () => {
    const { data, error } = await getRoomByCode(roomCode.toUpperCase());
    
    if (error || !data) {
      toast.error("Sala no encontrada");
      router.push("/");
      return;
    }

    if (data.status !== 'waiting') {
      toast.error("La sala ya ha comenzado");
      router.push(`/game-room/${data.id}`);
      return;
    }

    setRoom(data);
    loadParticipants();
  };

  const loadParticipants = async () => {
    if (!room) return;
    
    const { data, error } = await getRoomParticipants(room.id);
    
    if (!error && data) {
      setParticipants(data);
    }
  };

  useEffect(() => {
    if (room) {
      loadParticipants();
    }
  }, [room]);

  const handleJoin = async () => {
    if (!playerName.trim()) {
      toast.error("Por favor, ingresa tu nombre");
      return;
    }

    if (!room) {
      toast.error("Sala no encontrada");
      return;
    }

    setIsJoining(true);
    
    // Generar avatar
    const avatar = generateAvatarForName(playerName.trim());
    setAvatarUrl(avatar);

    try {
      const { data, error } = await addParticipant(
        room.id,
        playerName.trim(),
        avatar
      );

      if (error) {
        toast.error(error.message || "No se pudo unir a la sala");
        return;
      }

      if (data) {
        setIsJoined(true);
        setParticipantId(data.id);
        toast.success("Te has unido a la sala");
        await loadParticipants();
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error("No se pudo unir a la sala");
    } finally {
      setIsJoining(false);
    }
  };


  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "fácil":
        return "bg-green-500";
      case "medio":
        return "bg-yellow-500";
      case "difícil":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando sala...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Unirse a la Sala</CardTitle>
          <CardDescription className="text-center">
            Código: <span className="font-mono font-bold">{room.room_code}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Dificultad</p>
            <Badge className={getDifficultyColor(room.difficulty)}>
              {room.difficulty.charAt(0).toUpperCase() + room.difficulty.slice(1)}
            </Badge>
            <p className="text-sm text-muted-foreground mt-4">
              Jugadores: {participants.length} / {room.max_players}
            </p>
          </div>

          {!isJoined ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="playerName">Tu Nombre</Label>
                <Input
                  id="playerName"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && playerName.trim()) {
                      handleJoin();
                    }
                  }}
                  className="text-lg"
                  disabled={isJoining}
                />
              </div>

              <Button
                onClick={handleJoin}
                size="lg"
                className="w-full text-lg"
                disabled={!playerName.trim() || isJoining || participants.length >= room.max_players}
              >
                {isJoining ? "Uniéndose..." : "Unirse a la Sala"}
              </Button>

              {participants.length >= room.max_players && (
                <p className="text-sm text-center text-red-500">
                  La sala está llena
                </p>
              )}
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">¡Te has unido!</p>
                  {avatarUrl && (
                    <div className="flex justify-center mb-4">
                      <Image
                        src={avatarUrl}
                        alt="Tu avatar"
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Participantes ({participants.length}/{room.max_players}):</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-col items-center p-3 rounded-lg border bg-card"
                      >
                        <Image
                          src={p.avatar_url}
                          alt={p.player_name}
                          width={50}
                          height={50}
                          className="rounded-full mb-2"
                        />
                        <p className="text-sm font-medium truncate w-full text-center">
                          {p.player_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  Esperando a que el administrador inicie el juego...
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

