import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Leaderboard() {
    const { contestId } = useParams();
    const { token } = useAuth();

    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get(
                    `/contests/${contestId}/leaderboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("LEADERBOARD:", response.data);

                setLeaderboard(response.data.leaderboard);
            } catch (error) {
                console.error(
                    error.response?.data || error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [contestId, token]);

    if (loading) {
        return <p>Loading leaderboard...</p>;
    }

    return (
        <div>
            <h2>Leaderboard</h2>

            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                </thead>

                <tbody>
                    {leaderboard.map((player) => (
                        <tr key={player.userId}>
                            <td>{player.rank}</td>
                            <td>{player.username}</td>
                            <td>{player.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Leaderboard;