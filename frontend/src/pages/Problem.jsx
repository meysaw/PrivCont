import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import CodeEditor from "../components/CodeEditor";
import SubmissionHistory from "../components/SubmissionHistory";
function Problem() {
    const { contestId, problemId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await api.get(
                    `/contests/${contestId}/problems`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const foundProblem = response.data.problems.find(
                    problem => problem._id === problemId
                );

                setProblem(foundProblem);
            } catch (error) {
                console.error(
                    error.response?.data || error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [contestId, problemId, token]);

    if (loading) {
        return <p>Loading problem...</p>;
    }

    if (!problem) {
        return <p>Problem not found.</p>;
    }

    return (
        <div>
            <button onClick={() => navigate(`/contest/${contestId}`)}>
                ← Back to Contest
            </button>

            <h1>{problem.title}</h1>

            <p>
                Difficulty: {problem.difficulty}
            </p>

            <p>
                Points: {problem.points}
            </p>

            <hr />

            <h2>Problem</h2>

            <p>{problem.description}</p>

            <h3>Input</h3>
            <pre>{problem.inputFormat}</pre>

            <h3>Output</h3>
            <pre>{problem.outputFormat}</pre>

            <h3>Constraints</h3>
            <pre>{problem.constraints}</pre>
            <CodeEditor/>
            <SubmissionHistory/>
        </div>
    );
}

export default Problem;