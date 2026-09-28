import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const DEFAULT_CODE = {
  javascript: "// write your solution here\n",
  java:
    "public class Main {\n    public static void main(String[] args) {\n        \n    }\n}\n",
};

const EDITOR_OPTIONS = {
  fontSize: 15,
  fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
  minimap: { enabled: false },
  padding: { top: 16, bottom: 16 },
  scrollBeyondLastLine: false,
  smoothScrolling: true,
};

const difficultyPill = {
  Easy: "bg-emerald-50 text-emerald-600",
  Medium: "bg-amber-50 text-amber-600",
  Hard: "bg-rose-50 text-rose-600",
};

const statusText = (status) => {
  if (status === "Accepted") return "text-emerald-600";
  if (status === "Pending") return "text-amber-600";
  return "text-rose-600";
};

const formatCountdown = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
};

function Problem() {
  const { contestId, problemId } = useParams();
  const navigate = useNavigate();
  const [allProblems, setAllProblems] = useState([]);
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [contest, setContest] = useState(null);
  const [now, setNow] = useState(new Date());
  const [tab, setTab] = useState("description");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const [problemsRes, contestRes] = await Promise.all([
          api.get(`/contests/${contestId}/problems`),
          api.get(`/contests/${contestId}`),
        ]);
        setAllProblems(problemsRes.data.problems);
        setContest(contestRes.data.contest);
        const found = problemsRes.data.problems.find(
          (p) => p._id === problemId
        );
        setProblem(found || null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load problem.");
      }
    };
    fetchProblem();
  }, [contestId, problemId]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/submissions/my", {
        params: { contestId, problemId },
      });
      setHistory(res.data.submissions);
    } catch {
      // non-fatal
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestId, problemId]);

  const currentIndex = allProblems.findIndex((p) => p._id === problemId);
  const nextProblem = allProblems[currentIndex + 1];

  const startsAt = contest ? new Date(contest.startTime) : null;
  const endsAt = contest ? new Date(contest.endTime) : null;
  const notStarted = startsAt && now < startsAt;
  const ended = endsAt && now > endsAt;
  const canSubmit = contest && !notStarted && !ended;

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(DEFAULT_CODE[value]);
  };

  // Monaco measures character widths once. If the font finishes loading
  // afterwards, the cursor drifts, so re-measure when it's ready.
  const handleEditorMount = (_editor, monaco) => {
    document.fonts
      .load('15px "JetBrains Mono Variable"')
      .then(() => monaco.editor.remeasureFonts());
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    setError("");
    try {
      const res = await api.post("/submissions", {
        contestId,
        problemId,
        code,
        language,
      });
      setResult(res.data.submission);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !problem) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <p className="mt-16 text-center text-destructive">{error}</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <p className="mt-16 text-center text-muted-foreground">
          Loading problem...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Left panel */}
          <div className="overflow-y-auto rounded-2xl bg-background lg:sticky lg:top-6 lg:max-h-[calc(100vh-7rem)] lg:self-start">
            <div className="flex gap-6 border-b px-8 pt-5 text-sm">
              {["description", "submissions"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`-mb-px border-b-2 pb-3 capitalize transition-colors ${
                    tab === t
                      ? "border-foreground font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "description" && (
              <div className="space-y-8 p-8">
                <div className="space-y-4">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {currentIndex + 1}. {problem.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyPill[problem.difficulty]}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {problem.points} pts
                    </span>
                    {problem.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="whitespace-pre-wrap text-[15px] leading-7">
                  {problem.description}
                </p>

                <section className="space-y-2">
                  <h3 className="font-semibold">Input Format</h3>
                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-muted-foreground">
                    {problem.inputFormat}
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-semibold">Output Format</h3>
                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-muted-foreground">
                    {problem.outputFormat}
                  </p>
                </section>

                {problem.examples?.map((ex, i) => (
                  <section key={i} className="space-y-3">
                    <h3 className="font-semibold">Example {i + 1}</h3>
                    <div className="space-y-3 border-l-2 pl-4 font-mono text-sm">
                      <div>
                        <span className="font-semibold">Input:</span>
                        <pre className="mt-1 whitespace-pre-wrap">{ex.input}</pre>
                      </div>
                      <div>
                        <span className="font-semibold">Output:</span>
                        <pre className="mt-1 whitespace-pre-wrap">{ex.output}</pre>
                      </div>
                    </div>
                  </section>
                ))}

                <section className="space-y-2">
                  <h3 className="font-semibold">Constraints</h3>
                  <p className="whitespace-pre-wrap font-mono text-sm leading-7 text-muted-foreground">
                    {problem.constraints}
                  </p>
                </section>
              </div>
            )}

            {tab === "submissions" && (
              <div className="p-8">
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No submissions yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Tests</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((sub) => (
                        <TableRow key={sub._id}>
                          <TableCell
                            className={`font-medium ${statusText(sub.status)}`}
                          >
                            {sub.status}
                          </TableCell>
                          <TableCell>
                            {sub.testsPassed}/{sub.testsTotal}
                          </TableCell>
                          <TableCell>{sub.score}</TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {new Date(sub.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="space-y-4 rounded-2xl bg-background p-5">
            <div className="flex items-center justify-between">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-36 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>

              {canSubmit && (
                <span className="text-sm text-muted-foreground">
                  Time left: {formatCountdown(endsAt - now)}
                </span>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border">
              <Editor
                height="520px"
                language={language}
                theme="light"
                value={code}
                onChange={(value) => setCode(value ?? "")}
                onMount={handleEditorMount}
                options={EDITOR_OPTIONS}
              />
            </div>

            {notStarted && (
              <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                Contest starts in {formatCountdown(startsAt - now)}. Submissions
                open then.
              </p>
            )}
            {ended && (
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                This contest has ended. Submissions are closed.
              </p>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            {result && (
              <div className="space-y-1">
                <p className={`font-semibold ${statusText(result.status)}`}>
                  {result.status}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.testsPassed}/{result.testsTotal} tests passed &middot;{" "}
                  {result.score} pts
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {nextProblem && (
                <Button
                  variant="outline"
                  className="rounded-lg"
                  onClick={() =>
                    navigate(`/contest/${contestId}/problem/${nextProblem._id}`)
                  }
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={submitting || !canSubmit}
                className="rounded-lg bg-emerald-600 px-6 text-white hover:bg-emerald-700"
              >
                {submitting ? "Judging..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Problem;