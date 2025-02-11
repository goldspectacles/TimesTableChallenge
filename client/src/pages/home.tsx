import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Grid } from "@/components/game/grid";
import { Dumbbell } from "lucide-react";

export default function Home() {
  const [gameKey, setGameKey] = useState(0);

  const handleReset = () => {
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 flex flex-col items-center">
      <Card className="w-full max-w-4xl p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Math Gym
            </h1>
          </div>
          <p className="text-muted-foreground text-center max-w-xl">
            Train your multiplication skills like you train your muscles. 
            Each correct answer is a rep, each completed row is a set. 
            Let's build those math muscles! 💪
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Today's Workout</h2>
            <p className="text-sm text-muted-foreground">
              Complete the Times Tables Grid - Your Math Exercise Routine
            </p>
          </div>
          <Button 
            onClick={handleReset} 
            variant="outline"
            className="gap-2"
          >
            <Dumbbell className="w-4 h-4" />
            New Set
          </Button>
        </div>

        <Grid key={gameKey} />
      </Card>
    </div>
  );
}