"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { quizData, type Difficulty } from "@/lib/quiz-data";

export default function GamePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Validar que existan nombre y nivel
    const storedName = localStorage.getItem("quizName");
    const storedDifficulty = localStorage.getItem("quizDifficulty") as Difficulty | null;

    if (!storedName || !storedDifficulty) {
      toast.error("Por favor, completa la configuración primero");
      router.push("/setup");
      setIsLoading(false);
      return;
    }

    setName(storedName);
    setDifficulty(storedDifficulty);
    const start = Date.now();
    setStartTime(start);
    
    // Inicializar array de respuestas
    const questions = quizData[storedDifficulty];
    setAnswers(new Array(questions.length).fill(null));
    setIsLoading(false);

    // Iniciar cronómetro
    intervalRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [router]);

  // Cargar respuesta guardada cuando cambia la pregunta
  useEffect(() => {
    if (answers.length > 0) {
      setSelectedAnswer(answers[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, answers]);

  // Manejar atajos de teclado
  useEffect(() => {
    if (!difficulty) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // 1-4 para seleccionar opciones
      if (e.key >= "1" && e.key <= "4") {
        const optionIndex = parseInt(e.key) - 1;
        if (optionIndex >= 0 && optionIndex < 4) {
          const newAnswerIndex = optionIndex;
          setSelectedAnswer(newAnswerIndex);
          const newAnswers = [...answers];
          newAnswers[currentQuestionIndex] = newAnswerIndex;
          setAnswers(newAnswers);
        }
      }
      // Enter para avanzar
      if (e.key === "Enter" && selectedAnswer !== null) {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = selectedAnswer;
        
        const questions = quizData[difficulty];
        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        
        if (isLastQuestion) {
          // Guardar tiempo total y respuestas
          const totalTime = elapsedTime;
          localStorage.setItem("quizTotalTime", totalTime.toString());
          localStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
          localStorage.setItem("quizDifficulty", difficulty);
          router.push("/results");
        } else {
          setAnswers(updatedAnswers);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedAnswer, currentQuestionIndex, answers, elapsedTime, difficulty, router]);

  if (isLoading || !difficulty) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const questions = quizData[difficulty];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: string) => {
    const answerIndex = parseInt(value);
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("Por favor, selecciona una respuesta antes de continuar");
      return;
    }

    // Asegurar que la respuesta actual esté guardada
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Guardar tiempo total y respuestas
      const totalTime = elapsedTime;
      localStorage.setItem("quizTotalTime", totalTime.toString());
      localStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
      localStorage.setItem("quizDifficulty", difficulty);
      
      router.push("/results");
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Jugador: {name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(difficulty)}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="text-3xl font-mono font-bold">
                {formatTime(elapsedTime)}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
                <span>{Math.round(progress)}% completado</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedAnswer?.toString() ?? ""}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer rounded-md border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-muted-foreground min-w-[24px]">
                        {index + 1}.
                      </span>
                      <span className="flex-1">{option}</span>
                      <span className="text-xs text-muted-foreground">
                        [{index + 1}]
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            size="lg"
            disabled={selectedAnswer === null}
            className="min-w-[150px]"
          >
            {isLastQuestion ? "Finalizar" : "Siguiente"}
          </Button>
        </div>
      </div>
    </div>
  );
}

