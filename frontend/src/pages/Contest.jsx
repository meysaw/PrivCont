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
  if (difficulty === "Easy") return "bg-green-100 text-green-800";
  if (difficulty === "Medium") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

function Contest() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contestRes, problemsRes, leaderboardRes] = await Promise.all([
          api.get(`/contests/${contestId}`),
          api.get(`/contests/${contestId}/problems`),
          api.get(`/contests/${contestId}/leaderboard`),
        ]);
        setContest(contestRes.data.contest);
        setProblems(problemsRes.data.problems);
        setLeaderboard(leaderboardRes.data.leaderboard);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load contest.");
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
            {problems.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No problems in this contest.
              </p>
            )}
            {problems.map((problem) => (
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