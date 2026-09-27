import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const statusColor = (status) => {
  if (status === "Accepted") return "bg-green-100 text-green-800";
  if (status === "Pending") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
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

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/contests/${contestId}/problems`);
        setAllProblems(res.data.problems);
        const found = res.data.problems.find((p) => p._id === problemId);
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
      // non-fatal — just leave history empty
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contestId, problemId]);

  const currentIndex = allProblems.findIndex((p) => p._id === problemId);
  const nextProblem = allProblems[currentIndex + 1];

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(DEFAULT_CODE[value]);
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
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: problem statement */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  {problem.title}
                </CardTitle>
                <Badge>
                  {problem.difficulty} &middot; {problem.points} pts
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="whitespace-pre-wrap">{problem.description}</p>
              <div>
                <h3 className="font-semibold">Input Format</h3>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {problem.inputFormat}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Output Format</h3>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {problem.outputFormat}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Constraints</h3>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {problem.constraints}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right: editor + submit + history */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">Solution</CardTitle>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-hidden rounded-lg border shadow-sm">
                  <Editor
                    height="520px"
                    language={language}
                    theme="light"
                    value={code}
                    onChange={(value) => setCode(value ?? "")}
                    options={{
                      fontSize: 15,
                      minimap: { enabled: false },
                      padding: { top: 16, bottom: 16 },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                {result && (
                  <div className="flex items-center gap-3 rounded-md border p-3 text-sm">
                    <Badge className={statusColor(result.status)}>
                      {result.status}
                    </Badge>
                    <span className="text-muted-foreground">
                      {result.testsPassed}/{result.testsTotal} tests passed
                      &middot; {result.score} pts
                    </span>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? "Judging..." : "Submit"}
                  </Button>

                  {nextProblem && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/contest/${contestId}/problem/${nextProblem._id}`
                        )
                      }
                    >
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submission History</CardTitle>
              </CardHeader>
              <CardContent>
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
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((sub) => (
                        <TableRow key={sub._id}>
                          <TableCell>
                            <Badge className={statusColor(sub.status)}>
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {sub.testsPassed}/{sub.testsTotal}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {sub.score}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Problem;