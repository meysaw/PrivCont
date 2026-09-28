import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Users, Trophy, ListChecks, FileCode } from "lucide-react";

const StatCard = ({ icon: Icon, label, value }) => (
  <Card>
    <CardContent className="flex items-center gap-4 p-6">
      <div className="rounded-md bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentContests, setRecentContests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.stats);
        setRecentUsers(res.data.recentUsers);
        setRecentContests(res.data.recentContests);
      } catch (err) {
        setError(
          err.response?.status === 403
            ? "You don't have access to this page."
            : "Failed to load admin data."
        );
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
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate("/admin/problems")}>
            Manage Problems
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Users" value={stats.userCount} />
          <StatCard icon={Trophy} label="Contests" value={stats.contestCount} />
          <StatCard icon={ListChecks} label="Problems" value={stats.problemCount} />
          <StatCard icon={FileCode} label="Submissions" value={stats.submissionCount} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Contests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead className="text-right">Invite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentContests.map((contest) => (
                    <TableRow key={contest._id}>
                      <TableCell className="font-medium">
                        {contest.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {contest.host?.username}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {contest.inviteCode}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;