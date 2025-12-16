"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";

export function ProgressDemo() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5; // Incrementa el progreso en 5 cada 100ms
      });
    }, 100); // Cambia el valor de 100 para ajustar la velocidad

    return () => clearInterval(interval);
  }, []);

  return <Progress value={progress} className="w-[40%]" />;
}
