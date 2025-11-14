"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLeaderboard } from "@/lib/supabase/queries";
import type { LeaderboardEntry } from "@/lib/supabase/types";
import type { Difficulty } from "@/lib/quiz-data";
import { Trophy, Medal, Award } from "lucide-react";
import { toast } from "sonner";

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    if (selectedDifficulty === "all") {
      setFilteredLeaderboard(leaderboard);
    } else {
      setFilteredLeaderboard(leaderboard.filter((entry) => entry.difficulty === selectedDifficulty));
    }
  }, [selectedDifficulty, leaderboard]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getLeaderboard();
      if (error) {
        console.error("Error loading leaderboard:", error);
        toast.error("No se pudo cargar el leaderboard");
        setLeaderboard([]);
      } else {
        setLeaderboard(data || []);
        setFilteredLeaderboard(data || []);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      toast.error("No se pudo cargar el leaderboard");
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700";
    if (rank === 2) return "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700";
    if (rank === 3) return "bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl md:text-4xl">Leaderboard</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Los mejores resultados del quiz
                </CardDescription>
              </div>
              <Button onClick={() => router.push("/")} variant="outline">
                Volver al inicio
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedDifficulty}
              onValueChange={(value) => setSelectedDifficulty(value as Difficulty | "all")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="fácil">Fácil</TabsTrigger>
                <TabsTrigger value="medio">Medio</TabsTrigger>
                <TabsTrigger value="difícil">Difícil</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedDifficulty} className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Cargando leaderboard...</p>
                  </div>
                ) : filteredLeaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay resultados aún</p>
                    <Button
                      onClick={() => router.push("/setup")}
                      className="mt-4"
                      variant="outline"
                    >
                      Sé el primero en jugar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredLeaderboard.map((entry, index) => (
                      <Card
                        key={entry.id || index}
                        className={`transition-all ${
                          entry.rank && entry.rank <= 3
                            ? getRankColor(entry.rank)
                            : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
                              {entry.rank && entry.rank <= 3 ? (
                                getRankIcon(entry.rank)
                              ) : (
                                <span className="text-lg font-bold text-muted-foreground">
                                  {entry.rank || index + 1}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-lg truncate">
                                  {entry.player_name}
                                </p>
                                <Badge className={getDifficultyColor(entry.difficulty)}>
                                  {entry.difficulty.charAt(0).toUpperCase() +
                                    entry.difficulty.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span>
                                  {entry.correct_answers}/{entry.total_questions} aciertos
                                </span>
                                <span className="font-semibold text-foreground">
                                  {entry.score_percentage}%
                                </span>
                                <span className="font-mono">
                                  {formatTime(entry.total_time)}
                                </span>
                                {entry.created_at && (
                                  <span>
                                    {new Date(entry.created_at).toLocaleDateString("es-ES", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

