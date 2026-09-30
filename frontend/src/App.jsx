import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import DashBoard from "./pages/DashBoard"
import CreateContest from "./pages/CreateContest";
import Contest from "./pages/Contest";
import JoinContest from "./pages/JoinContest";
import Problem from "./pages/Problem";
import Register from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProblems from "./pages/AdminProblems";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
function App() {

  return(
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/problems" element={<ProtectedRoute><AdminProblems /></ProtectedRoute>} />       
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/>
         <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/create-contest" element={<ProtectedRoute><CreateContest/></ProtectedRoute>}/>
        <Route path="/contest/:contestId" element={<ProtectedRoute><Contest/></ProtectedRoute>}/>
        <Route path="/join-contest" element={<ProtectedRoute><JoinContest/></ProtectedRoute>}/>
        <Route path="/contest/:contestId/problem/:problemId" element={<ProtectedRoute><Problem/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
);
}

export default App;
