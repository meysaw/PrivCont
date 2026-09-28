import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, LogIn } from "lucide-react";

const getStatus = (contest, now) => {
  if (now < new Date(contest.startTime)) return "Upcoming";
  if (now > new Date(contest.endTime)) return "Ended";
  return "Live";
};

const statusStyle = {
  Upcoming: "text-blue-600",
  Live: "text-green-600",
  Ended: "text-gray-500",
};

function DashBoard() {
  const navigate = useNavigate();
  const [contests, setContests] = useState(null);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await api.get("/contests/my");
        setContests(res.data.contests);
      } catch (err) {
        setError("Couldn't load your contests.");
      }
    };
    fetchContests();
  }, []);

  const now = new Date();
  const groups = contests
    ? [
        { title: "Live now", items: contests.filter((c) => getStatus(c, now) === "Live") },
        { title: "Upcoming", items: contests.filter((c) => getStatus(c, now) === "Upcoming") },
        { title: "Past", items: contests.filter((c) => getStatus(c, now) === "Ended") },
      ]
    : [];

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome </h1>
          <p className="mt-2 text-muted-foreground">
            Create a contest for your friends, or join one with an invite code.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate("/create-contest")}
          >
            <CardHeader>
              <PlusCircle className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Create Contest</CardTitle>
              <CardDescription>
                Set up a private contest and invite your friends.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate("/join-contest")}
          >
            <CardHeader>
              <LogIn className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Join Contest</CardTitle>
              <CardDescription>
                Enter an invite code to join a friend's contest.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 space-y-8">
          <h2 className="text-xl font-semibold">Your Contests</h2>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {contests && contests.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You haven't joined any contests yet.
            </p>
          )}

          {groups.map(
            (group) =>
              group.items.length > 0 && (
                <div key={group.title} className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {group.title}
                  </h3>
                  {group.items.map((c) => {
                    const status = getStatus(c, now);
                    return (
                      <div
                        key={c._id}
                        onClick={() => navigate(`/contest/${c._id}`)}
                        className="flex cursor-pointer items-center justify-between rounded-md border bg-background p-4 transition-shadow hover:shadow-md"
                      >
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Hosted by {c.host} &middot;{" "}
                            {new Date(c.startTime).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className={statusStyle[status]}>
                          {status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;