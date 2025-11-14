"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { QRCodeSVG } from "qrcode.react";
import { createGameRoom } from "@/lib/supabase/rooms";
import type { Difficulty } from "@/lib/quiz-data";
import { toast } from "sonner";

export default function AdminPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [maxPlayers, setMaxPlayers] = useState([10]);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!adminName.trim()) {
      toast.error("Por favor, ingresa tu nombre");
      return;
    }
    if (!difficulty) {
      toast.error("Por favor, selecciona un nivel de dificultad");
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await createGameRoom(
        difficulty,
        maxPlayers[0],
        adminName.trim()
      );

      if (error) {
        console.error("Error creating room:", error);
        toast.error("No se pudo crear la sala");
        return;
      }

      if (data) {
        setRoomCode(data.room_code);
        setRoomId(data.id);
        toast.success("Sala creada exitosamente");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("No se pudo crear la sala");
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartGame = () => {
    if (roomId) {
      router.push(`/game-room/${roomId}`);
    }
  };

  const getJoinUrl = () => {
    if (typeof window !== "undefined" && roomCode) {
      return `${window.location.origin}/join/${roomCode}`;
    }
    return "";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Crear Sala de Juego</CardTitle>
          <CardDescription className="text-center">
            Configura tu sala y comparte el código con los participantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!roomCode ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="adminName">Tu Nombre (Admin)</Label>
                <Input
                  id="adminName"
                  type="text"
                  placeholder="Tu nombre"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-4">
                <Label>Nivel de Dificultad</Label>
                <RadioGroup
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value as Difficulty)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="fácil" id="fácil" className="peer sr-only" />
                    <Label
                      htmlFor="fácil"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-2xl font-bold">Fácil</span>
                      <span className="text-sm text-muted-foreground">5 preguntas básicas</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="medio" id="medio" className="peer sr-only" />
                    <Label
                      htmlFor="medio"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-2xl font-bold">Medio</span>
                      <span className="text-sm text-muted-foreground">5 preguntas intermedias</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="difícil" id="difícil" className="peer sr-only" />
                    <Label
                      htmlFor="difícil"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-2xl font-bold">Difícil</span>
                      <span className="text-sm text-muted-foreground">5 preguntas avanzadas</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label>Máximo de Jugadores: {maxPlayers[0]}</Label>
                <Slider
                  value={maxPlayers}
                  onValueChange={setMaxPlayers}
                  min={2}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>2</span>
                  <span>20</span>
                </div>
              </div>

              <Button
                onClick={handleCreateRoom}
                size="lg"
                className="w-full text-lg"
                disabled={!adminName.trim() || !difficulty || isCreating}
              >
                {isCreating ? "Creando sala..." : "Crear Sala"}
              </Button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Código de la Sala</p>
                  <p className="text-5xl font-bold tracking-wider">{roomCode}</p>
                </div>
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG value={getJoinUrl()} size={256} />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>URL para unirse:</p>
                  <p className="font-mono text-xs break-all">{getJoinUrl()}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleStartGame}
                  size="lg"
                  className="flex-1 text-lg"
                >
                  Iniciar Juego
                </Button>
                <Button
                  onClick={() => {
                    setRoomCode(null);
                    setRoomId(null);
                    setAdminName("");
                    setDifficulty("");
                    setMaxPlayers([10]);
                  }}
                  size="lg"
                  variant="outline"
                  className="flex-1 text-lg"
                >
                  Crear Nueva Sala
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

