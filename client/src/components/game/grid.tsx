import { Input } from "@/components/ui/input";
import { createGame, checkAnswer, type GridCell } from "@/lib/game";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Celebration } from "./celebration";
import { toast } from "@/hooks/use-toast";
import React from 'react';

export function Grid() {
  const [game, setGame] = useState(() => createGame());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedRows, setCompletedRows] = useState<number[]>([]);
  const [completedCols, setCompletedCols] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Debounced validation to avoid premature error messages
  const validateAnswer = useCallback((cell: GridCell, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    const expectedLength = cell.answer.toString().length;
    const currentLength = value.length;

    // Only validate if the input length matches the expected length
    if (currentLength === expectedLength && !checkAnswer(cell, numValue)) {
      toast({
        title: "Try again!",
        description: "That's not the correct answer",
        variant: "destructive"
      });
    }
  }, []);

  const handleInput = (row: number, col: number, value: string) => {
    // Allow empty string and only numbers
    if (value !== '' && !/^\d+$/.test(value)) return;

    const key = `${row},${col}`;
    const cell = game.grid[row][col];

    setAnswers(prev => ({
      ...prev,
      [key]: value
    }));

    // Add a small delay before validation
    if (value) {
      setTimeout(() => validateAnswer(cell, value), 500);
    }
  };

  useEffect(() => {
    // Check for completed rows and columns
    const newCompletedRows: number[] = [];
    const newCompletedCols: number[] = [];

    for (let i = 0; i < 12; i++) {
      let rowComplete = true;
      let colComplete = true;

      for (let j = 0; j < 12; j++) {
        const rowKey = `${i},${j}`;
        const colKey = `${j},${i}`;
        const rowAnswer = parseInt(answers[rowKey]);
        const colAnswer = parseInt(answers[colKey]);

        if (isNaN(rowAnswer) || !checkAnswer(game.grid[i][j], rowAnswer)) {
          rowComplete = false;
        }
        if (isNaN(colAnswer) || !checkAnswer(game.grid[j][i], colAnswer)) {
          colComplete = false;
        }
      }

      if (rowComplete && !completedRows.includes(i)) {
        newCompletedRows.push(i);
        toast({
          title: "Row Complete! 🎉",
          description: "Great job completing this row!"
        });
      }
      if (colComplete && !completedCols.includes(i)) {
        newCompletedCols.push(i);
        toast({
          title: "Column Complete! 🎉",
          description: "Excellent work on this column!"
        });
      }
    }

    if (newCompletedRows.length > 0) {
      setCompletedRows(prev => [...prev, ...newCompletedRows]);
    }
    if (newCompletedCols.length > 0) {
      setCompletedCols(prev => [...prev, ...newCompletedCols]);
    }

    // Check if game is complete
    if (newCompletedRows.length + completedRows.length === 12 &&
        newCompletedCols.length + completedCols.length === 12) {
      setIsComplete(true);
    }
  }, [answers, game.grid, completedRows, completedCols]);

  return (
    <div className="relative overflow-x-auto">
      {isComplete && <Celebration />}

      <div className="grid grid-cols-[auto_repeat(12,1fr)] gap-1 min-w-[800px]">
        <div className="w-12 h-12" /> {/* Empty corner cell */}

        {/* Column headers */}
        {game.colNumbers.map((num, i) => (
          <motion.div
            key={`col-${i}`}
            className={`flex items-center justify-center h-12 font-bold text-lg 
              ${completedCols.includes(i) ? 'bg-primary/20' : 'bg-muted'}`}
            animate={completedCols.includes(i) ? {
              scale: [1, 1.1, 1],
              transition: { duration: 0.5 }
            } : {}}
          >
            {num}
          </motion.div>
        ))}

        {/* Grid rows */}
        {game.grid.map((row, i) => (
          <React.Fragment key={`row-${i}`}>
            {/* Row headers */}
            <motion.div
              className={`flex items-center justify-center w-12 font-bold text-lg
                ${completedRows.includes(i) ? 'bg-primary/20' : 'bg-muted'}`}
              animate={completedRows.includes(i) ? {
                scale: [1, 1.1, 1],
                transition: { duration: 0.5 }
              } : {}}
            >
              {game.rowNumbers[i]}
            </motion.div>

            {/* Grid cells */}
            {row.map((cell: GridCell, j) => {
              const key = `${i},${j}`;
              const value = answers[key] || '';
              const numValue = parseInt(value);
              const isCorrect = !isNaN(numValue) && checkAnswer(cell, numValue);

              return (
                <div
                  key={key}
                  className={`relative border ${
                    isCorrect ? 'border-primary' : 'border-muted-foreground/20'
                  }`}
                >
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleInput(i, j, e.target.value)}
                    className={`h-12 text-center ${
                      isCorrect ? 'text-primary font-medium' : ''
                    }`}
                    min={1}
                    max={144}
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}