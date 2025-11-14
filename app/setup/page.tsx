"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import type { Difficulty } from "@/lib/quiz-data";

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");

  const handleStart = () => {
    if (!name.trim()) {
      toast.error("Por favor, ingresa tu nombre");
      return;
    }
    if (!difficulty) {
      toast.error("Por favor, selecciona un nivel de dificultad");
      return;
    }

    // Guardar en localStorage
    localStorage.setItem("quizName", name.trim());
    localStorage.setItem("quizDifficulty", difficulty);
    
    router.push("/game");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Configuración del Quiz</CardTitle>
          <CardDescription className="text-center">
            Ingresa tu nombre y selecciona el nivel de dificultad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim() && difficulty) {
                  handleStart();
                }
              }}
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

          <Button
            onClick={handleStart}
            size="lg"
            className="w-full text-lg"
            disabled={!name.trim() || !difficulty}
          >
            Empezar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

