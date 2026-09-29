import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Copy } from "lucide-react";

const difficultyColor = (difficulty) => {
  if (difficulty === "Easy") return "bg-white-100 text-green-500";
  if (difficulty === "Medium") return "bg-white-100 text-yellow-500";
  return "bg-white-100 text-red-500";
};
const getStatus = (contest, now) => {
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  if (now < start) return "Upcoming";
  if (now > end) return "Ended";
  return "Live";
};

const statusStyle = {
  Upcoming: "bg-white-100 text-blue-800",
  Live: "bg-white-100 text-green-800",
  Ended: "bg-white-100 text-gray-700",
};

const formatCountdown = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
};

function Contest() {
const [now, setNow] = useState(new Date());

useEffect(() => {
  const timer = setInterval(() => setNow(new Date()), 1000);
  return () => clearInterval(timer);
}, []);
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    const [contestRes, problemsRes, leaderboardRes] = await Promise.allSettled([
      api.get(`/contests/${contestId}`),
      api.get(`/contests/${contestId}/problems`),
      api.get(`/contests/${contestId}/leaderboard`),
    ]);

    if (contestRes.status === "rejected") {
      setError(
        contestRes.reason.response?.data?.message || "Failed to load contest."
      );
      return;
    }
    setContest(contestRes.value.data.contest);

    if (problemsRes.status === "fulfilled") {
      setProblems(problemsRes.value.data.problems);
    }

    if (leaderboardRes.status === "fulfilled") {
      setLeaderboard(leaderboardRes.value.data.leaderboard);
    }
  };
  fetchData();
}, [contestId]);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(contest.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <p className="mt-16 text-center text-destructive">{error}</p>
      </div>
    );
  }
  if (!contest) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <p className="mt-16 text-center text-muted-foreground">
          Loading contest...
        </p>
      </div>
    );
  }
  const status = getStatus(contest, now);

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{contest.name}</CardTitle>
                <CardDescription>
                  Hosted by {contest.host} &middot; {contest.participantCount}{" "}
                  participant{contest.participantCount !== 1 ? "s" : ""}
                </CardDescription>
                {(() => {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
      <Badge className={statusStyle[status]}>{status}</Badge>
      {status === "Upcoming" && (
        <span className="text-muted-foreground">
          Starts in {formatCountdown(new Date(contest.startTime) - now)}
        </span>
      )}
      {status === "Live" && (
        <span className="text-muted-foreground">
          Ends in {formatCountdown(new Date(contest.endTime) - now)}
        </span>
      )}
      <span className="text-muted-foreground">
        {new Date(contest.startTime).toLocaleString()} to{" "}
        {new Date(contest.endTime).toLocaleString()}
      </span>
    </div>
  );
})()}
              </div>
              <button
                onClick={copyInviteCode}
                className="flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 font-mono text-sm hover:bg-muted"
              >
                {contest.inviteCode} <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            {copied && <p className="text-sm text-muted-foreground">Copied!</p>}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problems</CardTitle>
          </CardHeader>
        <CardContent className="space-y-3">
  {status === "Upcoming" && (
    <p className="text-sm text-muted-foreground">
      The contest hasn't started yet. Problems will be available once it's live.
    </p>
  )}

  {status === "Ended" && (
    <p className="text-sm text-muted-foreground">
      The contest has ended. Problems are no longer accessible.
    </p>
  )}

  {status === "Live" && problems.length === 0 && (
    <p className="text-sm text-muted-foreground">
      No problems in this contest.
    </p>
  )}

  {status === "Live" &&
    problems.map((problem) => (
      <div
        key={problem._id}
        className="flex cursor-pointer items-center justify-between rounded-md border p-3 hover:bg-muted"
        onClick={() =>
          navigate(`/contest/${contestId}/problem/${problem._id}`)
        }
      >
        <span className="font-medium">{problem.title}</span>
        <div className="flex items-center gap-3">
          <Badge className={difficultyColor(problem.difficulty)}>
            {problem.difficulty}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {problem.points} pts
          </span>
        </div>
      </div>
    ))}
</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
                  <TableRow key={entry.username}>
                    <TableCell>{entry.rank}</TableCell>
                    <TableCell className="font-medium">
                      {entry.username}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {entry.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Contest;