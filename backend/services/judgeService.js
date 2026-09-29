const axios = require("axios");

const JUDGE0_URL = process.env.JUDGE0_URL;

const LANGUAGE_IDS = {
    javascript: 63,
    java: 62
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const runTestCase = async (code, language, testCase) => {

    const languageId = LANGUAGE_IDS[language.toLowerCase()];

    if (!languageId) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const submissionResponse = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
        {
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output
        },
        { timeout: 10000 }
    );

    const token = submissionResponse.data.token;

    while (true) {

        const resultResponse = await axios.get(
            `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
            { timeout: 10000 }
        );

        const result = resultResponse.data;

        if (result.status.id === 1 || result.status.id === 2) {
            await sleep(1000);
            continue;
        }

        return result;
    }
};

const judgeSubmission = async (code, language, testCases, points) => {

    const results = await Promise.all(
        testCases.map((testCase) => runTestCase(code, language, testCase))
    );

    let testsPassed = 0;
    let finalStatus = "Accepted";

    for (const result of results) {

        if (result.status.id === 3) {
            testsPassed++;
            continue;
        }

        if (finalStatus === "Accepted") {

            if (result.status.id === 4) {
                finalStatus = "Wrong Answer";
            } else if (result.status.id === 5) {
                finalStatus = "Time Limit";
            } else if (result.status.id === 6) {
                finalStatus = "Compilation Error";
            } else if (result.status.id === 7) {
                finalStatus = "Runtime Error";
            } else {
                finalStatus = "Wrong Answer";
            }
        }
    }

    const testsTotal = testCases.length;

    if (testsPassed === testsTotal) {
        return {
            status: "Accepted",
            testsPassed,
            testsTotal,
            score: points
        };
    }

    return {
        status: finalStatus,
        testsPassed,
        testsTotal,
        score: 0
    };
};

module.exports = {
    judgeSubmission
};