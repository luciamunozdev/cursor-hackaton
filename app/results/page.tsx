"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { quizData, type Difficulty } from "@/lib/quiz-data";

export default function ResultsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const storedName = localStorage.getItem("quizName");
    const storedDifficulty = localStorage.getItem("quizDifficulty") as Difficulty | null;
    const storedTime = localStorage.getItem("quizTotalTime");
    const storedAnswers = localStorage.getItem("quizAnswers");

    if (!storedName || !storedDifficulty || !storedTime || !storedAnswers) {
      router.push("/");
      return;
    }

    setName(storedName);
    setDifficulty(storedDifficulty);
    setTotalTime(parseInt(storedTime));

    const answers: (number | null)[] = JSON.parse(storedAnswers);
    const questions = quizData[storedDifficulty];
    setTotalQuestions(questions.length);

    // Calcular aciertos
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctIndex) {
        correct++;
      }
    });
    setCorrectAnswers(correct);
  }, [router]);

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

  const getScoreColor = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleBackToStart = () => {
    // Limpiar localStorage
    localStorage.removeItem("quizName");
    localStorage.removeItem("quizDifficulty");
    localStorage.removeItem("quizTotalTime");
    localStorage.removeItem("quizAnswers");
    router.push("/");
  };

  if (!difficulty) {
    return null;
  }

  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl md:text-4xl">Resultados del Quiz</CardTitle>
          <CardDescription className="text-lg">
            ¡Has completado el quiz!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Jugador</p>
              <p className="text-xl font-semibold">{name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nivel</p>
              <Badge className={getDifficultyColor(difficulty)}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tiempo Total</p>
              <p className="text-xl font-semibold font-mono">{formatTime(totalTime)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Aciertos</p>
              <p className="text-xl font-semibold">
                {correctAnswers} / {totalQuestions}
              </p>
            </div>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Puntuación</p>
            <p className={`text-5xl font-bold ${getScoreColor()}`}>
              {percentage}%
            </p>
          </div>

          <Button
            onClick={handleBackToStart}
            size="lg"
            className="w-full text-lg"
          >
            Volver al inicio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

