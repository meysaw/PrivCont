import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Editor from "@monaco-editor/react";

function CodeEditor() {
    const { contestId, problemId } = useParams();
    const { token } = useAuth();

    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!code.trim()) {
            return;
        }

        setSubmitting(true);
        setResult(null);

        try {
            const response = await api.post(
                "/submissions",
                {
                    contestId,
                    problemId,
                    code,
                    language
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("SUBMISSION:", response.data);

            setResult(response.data.submission);

        } catch (error) {
            console.error(
                error.response?.data || error
            );

            setResult({
                status: "Submission failed",
                score: 0
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Submit Solution</h2>

            <select
                value={language}
                onChange={(e) =>
                    setLanguage(e.target.value)
                }
            >
                <option value="javascript">
                    JavaScript
                </option>

                <option value="java">
                    Java
                </option>
            </select>

            <br />
            <br />

            <Editor
                height="400px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                    minimap: {
                        enabled: false
                    },
                    fontSize: 14,
                    automaticLayout: true
                }}
            />

            <br />

            <button
                onClick={handleSubmit}
                disabled={submitting}
            >
                {submitting
                    ? "Judging..."
                    : "Submit"}
            </button>

            {result && (
                <div>
                    <h3>Result</h3>

                    <p>
                        Status: {result.status}
                    </p>

                    <p>
                        Tests: {result.testsPassed}/
                        {result.testsTotal}
                    </p>

                    <p>
                        Score: {result.score}
                    </p>
                </div>
            )}
        </div>
    );
}

export default CodeEditor;