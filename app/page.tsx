"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-2xl px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Cursor Hackathon Gamification Quiz
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-muted-foreground">
              Pon a prueba tus conocimientos de desarrollo web
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => router.push("/setup")}
            >
              Comenzar
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => router.push("/leaderboard")}
            >
              Ver Leaderboard
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
