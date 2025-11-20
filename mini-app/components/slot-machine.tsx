"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>([
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  // Check win condition directly in render
  const hasWin =
    grid.some(
      (row) => row.every((f) => f === row[0])
    ) ||
    grid[0].every((f, i) => f === grid[1][i] && f === grid[2][i]);

  useEffect(() => {
    if (hasWin && !spinning) {
      setWin("You win!");
    } else {
      setWin(null);
    }
  }, [hasWin, spinning]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) => [
        [randomFruit(), ...prev[0].slice(0, 2)],
        [randomFruit(), ...prev[1].slice(0, 2)],
        [randomFruit(), ...prev[2].slice(0, 2)],
      ]);
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <div
            key={idx}
            className="w-16 h-16 flex items-center justify-center border rounded"
          >
            <img
              src={`/${fruit}.png`}
              alt={fruit}
              width={64}
              height={64}
            />
          </div>
        ))}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold">{win}</span>
          <Share text={`I just ${win} on the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
