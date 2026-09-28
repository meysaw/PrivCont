import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, X } from "lucide-react";

const difficultyColor = {
  Easy: "text-green-600",
  Medium: "text-yellow-600",
  Hard: "text-red-600",
};

const emptyTestCase = () => ({ input: "", output: "", isHidden: true });

function AdminProblems() {
  const [problems, setProblems] = useState(null);
  const [accessError, setAccessError] = useState("");
  const [listError, setListError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [points, setPoints] = useState(100);
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [constraints, setConstraints] = useState("");
  const [tags, setTags] = useState("");
  const [testCases, setTestCases] = useState([emptyTestCase()]);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProblems = async () => {
    try {
      const res = await api.get("/admin/problems");
      setProblems(res.data.problems);
    } catch (err) {
      setAccessError(
        err.response?.status === 403
          ? "You don't have access to this page."
          : "Failed to load problems."
      );
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const updateTestCase = (index, field, value) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    );
  };
  const addTestCase = () => setTestCases((prev) => [...prev, emptyTestCase()]);
  const removeTestCase = (index) =>
    setTestCases((prev) => prev.filter((_, i) => i !== index));

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDifficulty("Easy");
    setPoints(100);
    setInputFormat("");
    setOutputFormat("");
    setConstraints("");
    setTags("");
    setTestCases([emptyTestCase()]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    const cleaned = testCases.map((tc) => ({
      input: tc.input.trim(),
      output: tc.output.trim(),
      isHidden: tc.isHidden,
    }));

    if (cleaned.some((tc) => !tc.input || !tc.output)) {
      setFormError("Every test case needs both an input and an expected output.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/admin/problems", {
        title,
        description,
        difficulty,
        points: Number(points),
        inputFormat,
        outputFormat,
        constraints,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        testCases: cleaned,
      });
      resetForm();
      fetchProblems();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create problem.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (problem) => {
    if (!window.confirm(`Delete "${problem.title}"? This can't be undone.`)) {
      return;
    }
    setListError("");
    try {
      await api.delete(`/admin/problems/${problem._id}`);
      fetchProblems();
    } catch (err) {
      setListError(err.response?.data?.message || "Failed to delete problem.");
    }
  };

  if (accessError) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <p className="mt-16 text-center text-destructive">{accessError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <h1 className="text-2xl font-bold">Manage Problems</h1>

        {/* Create form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inputFormat">Input Format</Label>
                <Textarea
                  id="inputFormat"
                  rows={2}
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outputFormat">Output Format</Label>
                <Textarea
                  id="outputFormat"
                  rows={2}
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints</Label>
                <Input
                  id="constraints"
                  placeholder="1 <= n <= 1000"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="array, hash-map"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              {/* Test cases */}
              <div className="space-y-3">
                <Label>Test Cases</Label>
                {testCases.map((tc, i) => (
                  <div key={i} className="space-y-3 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Test case {i + 1}
                      </span>
                      {testCases.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTestCase(i)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`tc-in-${i}`}>Input</Label>
                        <Textarea
                          id={`tc-in-${i}`}
                          rows={3}
                          className="font-mono"
                          value={tc.input}
                          onChange={(e) =>
                            updateTestCase(i, "input", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`tc-out-${i}`}>Expected output</Label>
                        <Textarea
                          id={`tc-out-${i}`}
                          rows={3}
                          className="font-mono"
                          value={tc.output}
                          onChange={(e) =>
                            updateTestCase(i, "output", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={(e) =>
                          updateTestCase(i, "isHidden", e.target.checked)
                        }
                      />
                      Hidden test case
                    </label>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTestCase}>
                  <Plus className="mr-1 h-4 w-4" /> Add test case
                </Button>
              </div>

              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Create Problem"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Problem list */}
        <Card>
          <CardHeader>
            <CardTitle>
              All Problems{problems ? ` (${problems.length})` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {listError && <p className="text-sm text-destructive">{listError}</p>}

            {problems && problems.length === 0 && (
              <p className="text-sm text-muted-foreground">No problems yet.</p>
            )}

            {problems?.map((problem) => (
              <div
                key={problem._id}
                className="flex items-center justify-between rounded-md border bg-background p-3"
              >
                <div>
                  <p className="font-medium">{problem.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {problem.points} pts
                    {problem.tags?.length > 0 && ` · ${problem.tags.join(", ")}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={difficultyColor[problem.difficulty]}
                  >
                    {problem.difficulty}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(problem)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminProblems;