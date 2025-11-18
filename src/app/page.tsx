import Timer from "@/components/Timer";

export default function HomePage() {
  return (
    <div>
      <h1>My Timer</h1>

      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Timer />
      </div>
    </div>
  );
}
