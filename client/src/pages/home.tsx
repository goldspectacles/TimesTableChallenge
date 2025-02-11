import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Grid } from "@/components/game/grid";

export default function Home() {
  const [gameKey, setGameKey] = useState(0);

  const handleReset = () => {
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 flex flex-col items-center">
      <Card className="w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Times Tables Grid
          </h1>
          <Button onClick={handleReset} variant="outline">
            New Game
          </Button>
        </div>
        
        <Grid key={gameKey} />
      </Card>
    </div>
  );
}
