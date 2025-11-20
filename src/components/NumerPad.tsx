"use client";

type TimerState = "idle" | "running" | "paused";

type NumberPadProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  timerState: TimerState;
  setTime: (value: number) => void;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
};

export default function NumberPad({
  input,
  setInput,
  timerState,
  setTime,
  setTimerState
}: NumberPadProps) {
  function handleNumberPress(digit: string) {
    if (timerState === "running") return;
    if (input.length >= 6) return;

    setInput((prev) => prev + digit);
  }

  function handleDelete() {
    if (timerState === "running") return;
    setInput((prev) => prev.slice(0, -1));
  }

  function handleClear() {
    if (timerState === "running") return;
    setInput("");
    setTime(0);
    setTimerState("idle");
  }

  return (
    <section className="w-lg">
      <div className="grid grid-cols-3 grid-row-4 gap-3 mt-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberPress(num.toString())}
            className="border-2 py-2 rounded-lg cursor-pointer"
          >
            {num}
          </button>
        ))}

        <button
          onClick={handleDelete}
          className="border-2 border-blue-400 text-blue-400 py-2 rounded-lg cursor-pointer"
        >
          DEL
        </button>

        <button
          onClick={() => handleNumberPress("0")}
          className="border-2 py-2 rounded-lg cursor-pointer"
        >
          0
        </button>

        <button
          onClick={handleClear}
          className="border-2 border-[var(--warning)] text-[var(--warning)] py-2 rounded-lg cursor-pointer"
        >
          CLEAR
        </button>
      </div>
    </section>
  );
}
