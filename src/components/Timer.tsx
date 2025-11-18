"use client";

import { useEffect, useState, useRef } from "react";

type TimerState = "idle" | "running" | "paused";

export default function Timer() {
  const [time, setTime] = useState(15); // lowered it down for testing purposes - will change it back to 10 minutes later
  const [timerState, setTimerState] = useState<TimerState>("idle");

  // create ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastBeepRef = useRef<number | null>(null);

  // initialise audio
  useEffect(() => {
    audioRef.current = new Audio("/countdown.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.preload = "auto";
  }, []);

  // timer logic
  useEffect(() => {
    if (timerState !== "running") return;

    const interval = setInterval(() => {
      setTime((currentTime) => (currentTime > 0 ? currentTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState]);

  // handle countdown audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // only play audio for the last 10 seconds
    if (timerState === "running" && time <= 10 && time > 0) {
      if (lastBeepRef.current !== time) {
        audio.play().catch(() => {});
        lastBeepRef.current = time;
      }
    }

    // pause audio if timer paused
    if (timerState === "paused" && !audio.paused) {
      audio.pause();
    }

    // resume audio if running in the last 10 seconds
    if (timerState === "running" && time <= 10 && audio.paused) {
      audio.play().catch(() => {});
    }
  }, [time, timerState]);

  // format time to 00:00:00
  function formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  // conditional rendering start/pause/resume button
  function handleStartResumePause() {
    if (timerState === "idle" || timerState === "paused") {
      setTimerState("running");
    } else if (timerState === "running") {
      setTimerState("paused");
    }
  }

  // reset button function
  function handleReset() {
    setTimerState("idle");
    setTime(10 * 60);
    lastBeepRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  // determine the button label
  const buttonLabel =
    timerState === "idle"
      ? "Start"
      : timerState === "running"
      ? "Pause"
      : "Resume";

  // disable button when timer is 0
  const timerFinished = time === 0;

  return (
    <section>
      <h1 className="text-center text-9xl">{formatTime(time)}</h1>

      <div className="flex gap-4 items-center justify-center mt-4">
        <button
          className={`text-xl border-2 border-solid rounded-lg py-1 px-4 ${
            timerFinished
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-var(--background) cursor-pointer"
          }`}
          onClick={handleStartResumePause}
          disabled={timerFinished}
        >
          {buttonLabel}
        </button>

        <button
          className="cursor-pointer text-xl border-2 border-solid rounded-lg py-1 px-4"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </section>
  );
}
