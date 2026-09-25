import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
function ProblemList() {
    const { contestId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await api.get(
                    `/contests/${contestId}/problems`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("PROBLEMS:", response.data);

                setProblems(response.data.problems);
            } catch (error) {
                console.error(
                    error.response?.data || error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, [contestId, token]);

    if (loading) {
        return <p>Loading problems...</p>;
    }

    return (
        <div>
            <h2>Problems</h2>

            {problems.map((problem, index) => (
                <div key={problem._id}>
                    <div
                        onClick={() => navigate(`/contest/${contestId}/problem/${problem._id}`)}
                        style={{ cursor: "pointer", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
                    >
                        <h3>
                            {index + 1}. {problem.title}
                        </h3>

                    <p>
                        Difficulty: {problem.difficulty}
                    </p>

                        <p>
                            Points: {problem.points}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProblemList;