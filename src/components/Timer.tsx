"use client";

import { useEffect, useState, useRef } from "react";

import NumberPad from "./NumerPad";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type TimerState = "idle" | "running" | "paused";

export default function Timer() {
  const [time, setTime] = useState(10 * 60); // default - 10 minutes
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [numberPadInput, setNumberPadInput] = useState("");

  // create ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastBeepRef = useRef<number | null>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);
  const playedEndRef = useRef<boolean>(false);

  // initialise audio
  useEffect(() => {
    audioRef.current = new Audio("/countdown.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.preload = "auto";

    endAudioRef.current = new Audio("/end-buzzer.mp3");
    endAudioRef.current.volume = 0.3;
    endAudioRef.current.preload = "auto";
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
    const endAudio = endAudioRef.current;

    if (!audio || !endAudio) return;

    // only play audio for the last 10 seconds
    if (timerState === "running" && time <= 10 && time > 0) {
      if (lastBeepRef.current !== time) {
        const secondsIntoAudio = 10 - time;
        audio.currentTime = secondsIntoAudio;
        audio.play().catch(() => {});
        lastBeepRef.current = time;
      }
    }

    // pause audio if timer paused
    else if (timerState === "paused" && !audio.paused) {
      audio.pause();
    }

    // resume audio if running in the last 10 seconds
    else if (timerState === "running" && time <= 10 && audio.paused) {
      audio.play().catch(() => {});
    }

    // end sound - when timer hits 0
    if (timerState === "running" && time === 0 && !playedEndRef.current) {
      endAudio.currentTime = 0;
      endAudio.play().catch(() => {});
      playedEndRef.current = true;
    }

    // reset when timer resets
    if (time > 0) {
      playedEndRef.current = false;
    }
  }, [time, timerState]);

  // format time to HH:MM:SS
  function formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  // format number pad input to HH:MM:SS
  function formatTimeFromInput(input: string) {
    const clickedDigit = input.padStart(6, "0");
    const hours = clickedDigit.slice(0, 2);
    const minutes = clickedDigit.slice(2, 4);
    const seconds = clickedDigit.slice(4, 6);
    return `${hours}:${minutes}:${seconds}`;
  }

  // conditional rendering start/pause/resume button
  function handleStartResumePause() {
    if (timerState === "idle") {
      if (!numberPadInput && time === 0) return;

      if (numberPadInput) {
        const timerDigit = numberPadInput.padStart(6, "0");
        const hours = parseInt(timerDigit.slice(0, 2), 10);
        const minutes = parseInt(timerDigit.slice(2, 4), 10);
        const seconds = parseInt(timerDigit.slice(4, 6), 10);

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        setTime(totalSeconds);
      } else {
        setTime(10 * 60);
      }
      setTimerState("running");
    } else if (timerState === "paused") {
      if (time === 0) return;
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
  const startDisabled =
    (timerState === "idle" && !numberPadInput && time === 0) ||
    (timerState !== "idle" && time === 0);

  return (
    <section>
      <h1
        className={`text-center text-6xl sm:text-9xl transition-colors duration-300 ${
          time <= 10 ? "text-[var(--warning)]" : "text-[var(--foreground)]"
        }`}
      >
        {timerState === "idle" && numberPadInput
          ? formatTimeFromInput(numberPadInput)
          : formatTime(time)}
      </h1>

      <div className="flex gap-4 items-center justify-center mt-4">
        <button
          className={`text-base sm:text-xl border-2 border-solid rounded-lg py-1 px-4 ${
            startDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[var(--background)] cursor-pointer"
          }`}
          onClick={handleStartResumePause}
          disabled={startDisabled}
        >
          {buttonLabel}
        </button>

        <button
          className="cursor-pointer text-base sm:text-xl border-2 border-solid rounded-lg py-1 px-4"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="text-center mt-5">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="cursor-pointer text-base sm:text-xl border-2 border-solid rounded-lg py-1 px-4">
              Set Your Time
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            side="bottom"
            align="center"
            sideOffset={5}
            className="absolute left-1/2 transform -translate-x-1/2 sm:top-full"
          >
            <div>
              <NumberPad
                input={numberPadInput}
                setInput={setNumberPadInput}
                timerState={timerState}
                setTime={setTime}
                setTimerState={setTimerState}
              />
            </div>
            <DropdownMenu.Arrow className="fill-[#f5f5f5] mb-2" />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </section>
  );
}
