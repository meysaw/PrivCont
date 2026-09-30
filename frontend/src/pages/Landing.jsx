import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Users, Clock, Shield } from "lucide-react";
import Logo from "../components/Logo";
import { Button } from "@/components/ui/button";

const DEMO_SECONDS = 47 * 60 + 12;

const formatCountdown = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

function HeroMock() {
  const [seconds, setSeconds] = useState(DEMO_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : DEMO_SECONDS));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl bg-[#12181B] text-white shadow-xl">
      
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <p className="text-sm font-medium text-white/90">
            Friday Night Contest
          </p>
          <p className="text-xs text-white/50">3 problems &middot; Easy</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg tabular-nums text-emerald-400">
            {formatCountdown(seconds)}
          </p>
          <p className="text-xs text-white/50">time left</p>
        </div>
      </div>

      <div className="space-y-1 border-b border-white/10 px-6 py-5 font-mono text-sm leading-6 text-white/80">
        <p>
          <span className="text-white/40">1</span>
          <span className="ml-4 text-purple-300">function</span>{" "}
          <span className="text-blue-300">twoSum</span>(nums, target) {"{"}
        </p>
        <p>
          <span className="text-white/40">2</span>
          <span className="ml-4">for (let i = 0; i &lt; nums.length; i++) {"{"}</span>
        </p>
        <p>
          <span className="text-white/40">3</span>
          <span className="ml-8 text-white/50">// check remaining pairs</span>
        </p>
        <p>
          <span className="text-white/40">4</span>
          <span className="ml-4">{"}"}</span>
        </p>
        <p>
          <span className="text-white/40">5</span>
          {"}"}
        </p>
      </div>

      <div className="px-6 py-5">
        <p className="mb-3 text-xs text-white/50">Leaderboard</p>
        <div className="space-y-2">
          {[
            { rank: 1, name: "priya", score: 280 },
            { rank: 2, name: "devon", score: 240 },
            { rank: 3, name: "yuki", score: 190 },
          ].map((row) => (
            <div
              key={row.rank}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-3">
                <span className="w-4 text-white/40">{row.rank}</span>
                <span>{row.name}</span>
              </span>
              <span className="font-mono text-white/70">{row.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#12181B]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo size="default" />
      
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight lg:text-6xl">
            Run a coding contest with the people you actually code with.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#12181B]/70">
            Set a timer, pick a difficulty, invite your friends with a code.
            Everyone solves the same problems, submissions get judged for
            real, and the leaderboard updates as you go.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
              Get started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="ghost">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <HeroMock />
      </section>

      
    </div>
  );
}

export default Landing;