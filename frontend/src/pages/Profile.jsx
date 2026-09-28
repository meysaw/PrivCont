import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Trophy, Medal, FileCode, Check } from "lucide-react";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-2xl bg-background p-6">
    <div className="rounded-lg bg-primary/10 p-3">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/me/stats");
        setStats(res.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      }
    };
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <p className="mt-16 text-center text-destructive">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <p className="mt-16 text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <div className="flex items-center gap-5 rounded-2xl bg-background p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {user?.username}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.email}
              {user?.createdAt &&
                ` · Joined ${new Date(user.createdAt).toLocaleDateString(
                  undefined,
                  { month: "long", year: "numeric" }
                )}`}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Trophy} label="Contests" value={stats.contestsParticipated} />
          <StatCard icon={Medal} label="Wins" value={stats.contestsWon} />
          <StatCard icon={FileCode} label="Submissions" value={stats.submissionCount} />
          <StatCard icon={Check} label="Accepted" value={stats.acceptedCount} />
        </div>
      </div>
    </div>
  );
}

export default Profile;