import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function CreateContest() {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [problemCount, setProblemCount] = useState(2);

    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/contests",
                {
                    name,
                    difficulty,
                    problemCount
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate(`/contest/${response.data.contest._id}`);
        } catch (error) {
            console.error(error.response?.data || error);
        }
    };

    return (
        <div>
            <h1>Create Contest</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Contest Name</label>
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Coding Contest"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Difficulty</label>
                    <br />

                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Number of Problems</label>
                    <br />

                    <input
                        type="number"
                        min="1"
                        value={problemCount}
                        onChange={(e) =>
                            setProblemCount(Number(e.target.value))
                        }
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Create Contest
                </button>

            </form>
        </div>
    );
}

export default CreateContest;