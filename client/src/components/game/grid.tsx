import { Input } from "@/components/ui/input";
import { createGame, checkAnswer, type GridCell } from "@/lib/game";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Celebration } from "./celebration";
import { Timer } from "./timer";
import { toast } from "@/hooks/use-toast";
import React from 'react';

export function Grid() {
  const [game, setGame] = useState(() => createGame());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedRows, setCompletedRows] = useState<number[]>([]);
  const [completedCols, setCompletedCols] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  // Debounced validation to avoid premature error messages
  const validateAnswer = useCallback((cell: GridCell, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    const expectedLength = cell.answer.toString().length;
    const currentLength = value.length;

    // Only validate if the input length matches the expected length
    if (currentLength === expectedLength && !checkAnswer(cell, numValue)) {
      toast({
        title: "One more rep! 💪",
        description: "Keep pushing! That's not quite right",
        variant: "destructive"
      });
    } else if (checkAnswer(cell, numValue) && !timerStarted) {
      setTimerStarted(true);
    }
  }, [timerStarted]);

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

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    const key = e.key;
    let nextRow = row;
    let nextCol = col;

    switch (key) {
      case 'ArrowUp':
        nextRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        nextRow = Math.min(11, row + 1);
        break;
      case 'ArrowLeft':
        nextCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        nextCol = Math.min(11, col + 1);
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextKey = `${nextRow},${nextCol}`;
    inputRefs.current[nextKey]?.focus();
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
          title: "Set Complete! 💪",
          description: "Great form! You've mastered this multiplication set!"
        });
      }
      if (colComplete && !completedCols.includes(i)) {
        newCompletedCols.push(i);
        toast({
          title: "Another Set Done! 🏋️‍♂️",
          description: "You're getting stronger at these multiplications!"
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
      setTimerStarted(false); // Stop the timer when game is complete
    }
  }, [answers, game.grid, completedRows, completedCols]);

  return (
    <div className="relative overflow-x-auto">
      {isComplete && <Celebration />}

      <div className="mb-4 flex items-center justify-between">
        <Timer isRunning={timerStarted} />
        <div className="text-sm text-muted-foreground">
          Complete rows and columns to build your math strength!
        </div>
      </div>

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
                    onWheel={(e) => e.currentTarget.blur()}
                    onKeyDown={(e) => handleKeyDown(e, i, j)}
                    ref={(el) => {
                      if (el) inputRefs.current[key] = el;
                    }}
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