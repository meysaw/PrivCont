import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle, LogIn } from "lucide-react";

function DashBoard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
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
      </div>
    </div>
  );
}

export default DashBoard;