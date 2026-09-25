import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function SubmissionHistory() {
    const { contestId, problemId } = useParams();
    const { token } = useAuth();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await api.get(
                    `/submissions/my?contestId=${contestId}&problemId=${problemId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "SUBMISSIONS:",
                    response.data
                );

                setSubmissions(response.data.submissions);

            } catch (error) {
                console.error(
                    error.response?.data || error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [contestId, problemId, token]);

    if (loading) {
        return <p>Loading submissions...</p>;
    }

    return (
        <div>
            <h2>Submission History</h2>

            {submissions.length === 0 ? (
                <p>No submissions yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Score</th>
                            <th>Tests</th>
                            <th>Language</th>
                            <th>Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {submissions.map((submission) => (
                            <tr key={submission._id}>
                                <td>
                                    {submission.status}
                                </td>

                                <td>
                                    {submission.score}
                                </td>

                                <td>
                                    {submission.testsPassed}/
                                    {submission.testsTotal}
                                </td>

                                <td>
                                    {submission.language}
                                </td>

                                <td>
                                    {new Date(
                                        submission.createdAt
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SubmissionHistory;