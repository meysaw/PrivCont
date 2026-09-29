import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DURATIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1 hour 30 minutes" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
];

const toLocalInputValue = (date) => {
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

function CreateContest() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [problemCount, setProblemCount] = useState(3);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (new Date(startTime) < new Date()) {
      setError("Start time must be in the future.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/contests", {
        name,
        difficulty,
        problemCount: Number(problemCount),
        startTime: new Date(startTime).toISOString(),
        durationMinutes: Number(duration),
      });
      navigate(`/contest/${res.data.contest._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create contest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Contest</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contest Name</Label>
                <Input
                  id="name"
                  placeholder="Friday Night Contest"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <Label htmlFor="problemCount">Number of Problems</Label>
                <Input
                  id="problemCount"
                  type="number"
                  min="1"
                  max="10"
                  value={problemCount}
                  onChange={(e) => setProblemCount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  min={toLocalInputValue(new Date())}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Contest"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateContest;