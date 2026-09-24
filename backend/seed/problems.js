const mongoose = require("mongoose");
require("dotenv").config();

const Problem = require("../models/Problem");

const problems = [
    {
        title: "Two Sum",
        description: "Given an array of integers and a target, find two numbers that add up to the target.",
        difficulty: "Easy",
        points: 100,
        inputFormat: "The first line contains n. The second line contains n integers. The third line contains the target.",
        outputFormat: "Print the indices of the two numbers.",
        constraints: "2 <= n <= 1000",
        tags: ["array", "hash-map"],
        testCases: [
            {
                input: "4\n2 7 11 15\n9",
                output: "0 1",
                isHidden: false
            },
            {
                input: "5\n3 2 4 8 1\n6",
                output: "1 2",
                isHidden: true
            },
            {
                input: "6\n1 5 3 7 9 2\n10",
                output: "0 4",
                isHidden: true
            },
            {
                input: "4\n-3 4 2 7\n1",
                output: "0 1",
                isHidden: true
            }
        ]
    },

    {
        title: "Reverse String",
        description: "Given a string, print the string in reverse order.",
        difficulty: "Easy",
        points: 100,
        inputFormat: "A single string.",
        outputFormat: "The reversed string.",
        constraints: "1 <= length <= 1000",
        tags: ["string"],
        testCases: [
            {
                input: "hello",
                output: "olleh",
                isHidden: false
            },
            {
                input: "racecar",
                output: "racecar",
                isHidden: true
            },
            {
                input: "abcdef",
                output: "fedcba",
                isHidden: true
            },
            {
                input: "a",
                output: "a",
                isHidden: true
            }
        ]
    },

    {
        title: "Palindrome Check",
        description: "Determine whether a given string is a palindrome.",
        difficulty: "Easy",
        points: 100,
        inputFormat: "A single string.",
        outputFormat: "Print YES if the string is a palindrome, otherwise print NO.",
        constraints: "1 <= length <= 1000",
        tags: ["string", "two-pointers"],
        testCases: [
            {
                input: "racecar",
                output: "YES",
                isHidden: false
            },
            {
                input: "hello",
                output: "NO",
                isHidden: true
            },
            {
                input: "level",
                output: "YES",
                isHidden: true
            },
            {
                input: "computer",
                output: "NO",
                isHidden: true
            }
        ]
    },

    {
        title: "Find Maximum",
        description: "Given an array of integers, find the largest value.",
        difficulty: "Easy",
        points: 100,
        inputFormat: "The first line contains n. The second line contains n integers.",
        outputFormat: "Print the maximum value.",
        constraints: "1 <= n <= 10000",
        tags: ["array"],
        testCases: [
            {
                input: "5\n3 9 2 7 4",
                output: "9",
                isHidden: false
            },
            {
                input: "4\n10 2 8 6",
                output: "10",
                isHidden: true
            },
            {
                input: "6\n-5 -2 -10 -1 -7 -3",
                output: "-1",
                isHidden: true
            },
            {
                input: "5\n100 50 75 200 25",
                output: "200",
                isHidden: true
            }
        ]
    },

    {
        title: "Count Vowels",
        description: "Count the number of vowels in a given string.",
        difficulty: "Easy",
        points: 100,
        inputFormat: "A single string.",
        outputFormat: "Print the number of vowels.",
        constraints: "1 <= length <= 1000",
        tags: ["string"],
        testCases: [
            {
                input: "hello",
                output: "2",
                isHidden: false
            },
            {
                input: "programming",
                output: "3",
                isHidden: true
            },
            {
                input: "AEIOU",
                output: "5",
                isHidden: true
            },
            {
                input: "xyz",
                output: "0",
                isHidden: true
            }
        ]
    },

    {
        title: "Binary Search",
        description: "Given a sorted array and a target, find the target index using binary search.",
        difficulty: "Medium",
        points: 200,
        inputFormat: "The first line contains n. The second line contains n sorted integers. The third line contains the target.",
        outputFormat: "Print the index of the target, or -1 if it does not exist.",
        constraints: "1 <= n <= 100000",
        tags: ["binary-search", "array"],
        testCases: [
            {
                input: "5\n1 3 5 7 9\n7",
                output: "3",
                isHidden: false
            },
            {
                input: "6\n2 4 6 8 10 12\n2",
                output: "0",
                isHidden: true
            },
            {
                input: "7\n1 3 5 7 9 11 13\n8",
                output: "-1",
                isHidden: true
            },
            {
                input: "8\n-10 -5 -2 0 3 7 12 20\n-2",
                output: "2",
                isHidden: true
            }
        ]
    },

    {
        title: "Merge Intervals",
        description: "Given a collection of intervals, merge all overlapping intervals.",
        difficulty: "Medium",
        points: 200,
        inputFormat: "The first line contains n followed by n intervals.",
        outputFormat: "Print the merged intervals.",
        constraints: "1 <= n <= 10000",
        tags: ["sorting", "intervals"],
        testCases: [
            {
                input: "4\n1 3\n2 6\n8 10\n9 12",
                output: "1 6\n8 12",
                isHidden: false
            },
            {
                input: "3\n1 2\n3 4\n5 6",
                output: "1 2\n3 4\n5 6",
                isHidden: true
            },
            {
                input: "3\n1 5\n2 3\n4 8",
                output: "1 8",
                isHidden: true
            },
            {
                input: "2\n1 10\n2 5",
                output: "1 10",
                isHidden: true
            }
        ]
    },

    {
        title: "Valid Parentheses",
        description: "Determine whether a string containing brackets is valid.",
        difficulty: "Medium",
        points: 200,
        inputFormat: "A string containing parentheses, brackets and braces.",
        outputFormat: "Print YES if valid, otherwise NO.",
        constraints: "1 <= length <= 10000",
        tags: ["stack", "string"],
        testCases: [
            {
                input: "()[]{}",
                output: "YES",
                isHidden: false
            },
            {
                input: "([{}])",
                output: "YES",
                isHidden: true
            },
            {
                input: "([)]",
                output: "NO",
                isHidden: true
            },
            {
                input: "(((",
                output: "NO",
                isHidden: true
            }
        ]
    },

    {
        title: "Course Schedule",
        description: "Determine whether all courses can be completed given prerequisite relationships.",
        difficulty: "Hard",
        points: 300,
        inputFormat: "The first line contains the number of courses and prerequisites.",
        outputFormat: "Print YES if all courses can be completed, otherwise NO.",
        constraints: "1 <= courses <= 100000",
        tags: ["graph", "topological-sort"],
        testCases: [
            {
                input: "2 1\n1 0",
                output: "YES",
                isHidden: false
            },
            {
                input: "2 2\n1 0\n0 1",
                output: "NO",
                isHidden: true
            },
            {
                input: "4 3\n1 0\n2 1\n3 2",
                output: "YES",
                isHidden: true
            },
            {
                input: "3 3\n1 0\n2 1\n0 2",
                output: "NO",
                isHidden: true
            }
        ]
    },

    {
        title: "Longest Increasing Subsequence",
        description: "Find the length of the longest strictly increasing subsequence.",
        difficulty: "Hard",
        points: 300,
        inputFormat: "The first line contains n. The second line contains n integers.",
        outputFormat: "Print the length of the longest increasing subsequence.",
        constraints: "1 <= n <= 100000",
        tags: ["dynamic-programming", "binary-search"],
        testCases: [
            {
                input: "8\n10 9 2 5 3 7 101 18",
                output: "4",
                isHidden: false
            },
            {
                input: "5\n1 2 3 4 5",
                output: "5",
                isHidden: true
            },
            {
                input: "5\n5 4 3 2 1",
                output: "1",
                isHidden: true
            },
            {
                input: "6\n10 22 9 33 21 50",
                output: "4",
                isHidden: true
            }
        ]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Problem.deleteMany();

        await Problem.insertMany(problems);

        console.log("Problems seeded successfully");
        console.log(`Inserted ${problems.length} problems`);
        console.log(`Inserted ${problems.reduce((total, problem) => total + problem.testCases.length, 0)} test cases`);

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

seedDatabase();