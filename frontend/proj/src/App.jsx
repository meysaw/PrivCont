import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import DashBoard from "./pages/DashBoard"
import CreateContest from "./pages/CreateContest";
import Contest from "./pages/Contest";
import JoinContest from "./pages/JoinContest";
import Problem from "./pages/Problem";
function App() {

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/>
        <Route path="/create-contest" element={<ProtectedRoute><CreateContest/></ProtectedRoute>}/>
        <Route path="/contest/:contestId" element={<ProtectedRoute><Contest/></ProtectedRoute>}/>
        <Route path="/join-contest" element={<ProtectedRoute><JoinContest/></ProtectedRoute>}/>
        <Route path="/contest/:contestId/problem/:problemId" element={<ProtectedRoute><Problem/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
);
}

export default App;
