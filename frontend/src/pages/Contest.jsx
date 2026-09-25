import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProblemList from "../components/ProblemList";
import Leaderboard from "../components/LeaderBoard";
function Contest() {
    const params = useParams();

    console.log("PARAMS:", params);
    const { contestId } = useParams();
    
    const { token } = useAuth();

    const [contest, setContest] = useState(null);

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const response = await api.get(
                    `/contests/${contestId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setContest(response.data.contest);

            } catch (error) {
                console.error(
                    error.response?.data || error
                );
            }
        };

        fetchContest();
    }, [contestId, token]);

    if (!contest) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{contest.name}</h1>

            <h2>Invite Code</h2>
            <p>{contest.inviteCode}</p>

            <p>
                Participants: {contest.participantCount}
            </p>

            <p>
                Host: {contest.host}
            </p>
            <ProblemList />
            <Leaderboard />
        </div>
    
    );
}

export default Contest;