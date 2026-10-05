import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function AttemptTest() {

    const { testId } = useParams();
    const navigate = useNavigate();

    // ==========================================
    // TEST DATA
    // ==========================================

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);

    // ==========================================
    // EXAM STATE
    // ==========================================

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);

    // ==========================================
    // UI STATE
    // ==========================================

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    // ==========================================
    // LOAD TEST
    // ==========================================

    const loadTest = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/tests/${testId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setMessage(
                    data.message || "Unable to load test"
                );

                return;
            }

            setTest(data.test);
            setQuestions(data.questions || []);

            setTimeLeft(
                data.test.duration * 60
            );

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        loadTest();

    }, [testId]);

    // ==========================================
    // TIMER
    // ==========================================

    useEffect(() => {

        if (
            loading ||
            timeLeft <= 0 ||
            submitting
        ) {
            return;
        }

        const timer = setInterval(() => {

            setTimeLeft(previousTime => {

                if (previousTime <= 1) {

                    clearInterval(timer);

                    return 0;
                }

                return previousTime - 1;
            });

        }, 1000);

        return () => {
            clearInterval(timer);
        };

    }, [
        loading,
        timeLeft,
        submitting
    ]);

    // ==========================================
    // AUTO SUBMIT WHEN TIME IS OVER
    // ==========================================

    useEffect(() => {

        if (
            !loading &&
            timeLeft === 0 &&
            questions.length > 0 &&
            !submitting
        ) {

            submitTest(true);
        }

    }, [
        timeLeft,
        loading
    ]);

    // ==========================================
    // FORMAT TIMER
    // ==========================================

    const formatTime = (seconds) => {

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds = seconds % 60;

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );
    };

    // ==========================================
    // ANSWER QUESTION
    // ==========================================

    const handleAnswer = (
        questionId,
        selectedAnswer
    ) => {

        setAnswers(previousAnswers => ({
            ...previousAnswers,
            [questionId]: selectedAnswer
        }));
    };

    // ==========================================
    // QUESTION NAVIGATION
    // ==========================================

    const goToQuestion = (index) => {

        if (
            index >= 0 &&
            index < questions.length
        ) {

            setCurrentQuestion(index);
        }
    };

    // ==========================================
    // SUBMIT TEST
    // ==========================================

    const submitTest = async (automatic = false) => {

        if (submitting) {
            return;
        }

        // Count unanswered questions
        const unansweredCount = questions.filter(
            question => !answers[question._id]
        ).length;

        // ==========================================
        // MANUAL SUBMISSION WARNING
        // ==========================================

        if (!automatic) {

            let confirmMessage;

            if (unansweredCount > 0) {

                confirmMessage =
                    `You still have ${unansweredCount} unanswered question${unansweredCount > 1 ? "s" : ""}.\n\nDo you still want to submit the test?`;

            } else {

                confirmMessage =
                    "You have answered all questions.\n\nAre you sure you want to submit the test?";
            }

            const confirmSubmit =
                window.confirm(confirmMessage);

            if (!confirmSubmit) {
                return;
            }
        }

        // ==========================================
        // START SUBMISSION
        // ==========================================

        setSubmitting(true);
        setMessage("");

        try {

            const token =
                localStorage.getItem("token");

            const formattedAnswers =
                questions.map(question => ({

                    questionId:
                        question._id,

                    selectedAnswer:
                        answers[question._id] || ""

                }));

            const response =
                await fetch(
                    `${API_URL}/results/submit`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            testId,

                            answers:
                                formattedAnswers
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Test submission failed"
                );

                setSubmitting(false);

                return;
            }

            // Save latest result
            localStorage.setItem(
                "latestResult",
                JSON.stringify(data.result)
            );

            // Go to result page
            navigate("/result");

        } catch (error) {

            console.error(
                "Submission error:",
                error
            );

            setMessage(
                "Unable to submit test"
            );

            setSubmitting(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f4f6f9"
                }}
            >
                <h2>Loading test...</h2>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (message && !test) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f4f6f9"
                }}
            >

                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        textAlign: "center"
                    }}
                >

                    <h2>Error</h2>

                    <p>{message}</p>

                    <button
                        onClick={() =>
                            navigate(
                                "/student-dashboard"
                            )
                        }
                        style={{
                            marginTop: "15px",
                            padding: "10px 18px",
                            background: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }

    // ==========================================
    // NO QUESTIONS
    // ==========================================

    if (
        !questions ||
        questions.length === 0
    ) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f4f6f9"
                }}
            >

                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        textAlign: "center"
                    }}
                >

                    <h2>
                        No Questions Available
                    </h2>

                    <button
                        onClick={() =>
                            navigate(
                                "/student-dashboard"
                            )
                        }
                        style={{
                            marginTop: "15px",
                            padding: "10px 18px",
                            background: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }

    // ==========================================
    // CURRENT QUESTION
    // ==========================================

    const question =
        questions[currentQuestion];

    const selectedAnswer =
        answers[question._id] || "";

    const answeredCount =
        Object.keys(answers).length;

    const unansweredCount =
        questions.length - answeredCount;

    const progress =
        (
            (currentQuestion + 1) /
            questions.length
        ) * 100;

    const isTimeLow =
        timeLeft <= 60;

    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f9",
                paddingBottom: "40px"
            }}
        >

            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "25px 20px"
                }}
            >

                {/* ==========================================
                    EXAM HEADER
                ========================================== */}

                <div
                    style={{
                        background: "white",
                        padding: "20px 25px",
                        borderRadius: "12px",
                        marginBottom: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)"
                    }}
                >

                    <div>

                        <h1>
                            {test.title}
                        </h1>

                        <p
                            style={{
                                color: "#6b7280",
                                marginTop: "5px"
                            }}
                        >
                            {test.description}
                        </p>

                    </div>

                    {/* TIMER */}

                    <div
                        style={{
                            background:
                                isTimeLow
                                    ? "#fee2e2"
                                    : "#eef2ff",

                            color:
                                isTimeLow
                                    ? "#b91c1c"
                                    : "#3730a3",

                            padding: "12px 22px",
                            borderRadius: "10px",
                            textAlign: "center",
                            minWidth: "150px"
                        }}
                    >

                        <small>
                            Time Remaining
                        </small>

                        <h2
                            style={{
                                marginTop: "4px"
                            }}
                        >
                            {formatTime(timeLeft)}
                        </h2>

                    </div>

                </div>

                {/* ==========================================
                    PROGRESS
                ========================================== */}

                <div
                    style={{
                        background: "white",
                        padding: "18px 20px",
                        borderRadius: "12px",
                        marginBottom: "20px"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px"
                        }}
                    >

                        <span>
                            Question{" "}
                            <strong>
                                {currentQuestion + 1}
                            </strong>
                            {" "}of{" "}
                            <strong>
                                {questions.length}
                            </strong>
                        </span>

                        <span>
                            Answered:{" "}
                            <strong>
                                {answeredCount}
                            </strong>
                            {" / "}
                            {questions.length}
                        </span>

                    </div>

                    <div
                        style={{
                            height: "8px",
                            background: "#e5e7eb",
                            borderRadius: "10px",
                            overflow: "hidden"
                        }}
                    >

                        <div
                            style={{
                                width: `${progress}%`,
                                height: "100%",
                                background: "#4f46e5",
                                transition: "width 0.3s"
                            }}
                        />

                    </div>

                </div>

                {/* ==========================================
                    MAIN EXAM AREA
                ========================================== */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 280px",
                        gap: "20px"
                    }}
                >

                    {/* QUESTION */}

                    <div
                        style={{
                            background: "white",
                            padding: "30px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.06)"
                        }}
                    >

                        <p
                            style={{
                                color: "#6b7280",
                                marginBottom: "10px"
                            }}
                        >
                            Question{" "}
                            {currentQuestion + 1}
                        </p>

                        <h2
                            style={{
                                lineHeight: "1.5",
                                marginBottom: "30px"
                            }}
                        >
                            {question.questionText}
                        </h2>

                        {/* OPTIONS */}

                        <div>

                            {question.options.map(
                                (option, index) => {

                                    const isSelected =
                                        selectedAnswer === option;

                                    return (

                                        <label
                                            key={index}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                padding: "15px",
                                                marginBottom: "12px",

                                                border:
                                                    isSelected
                                                        ? "2px solid #4f46e5"
                                                        : "1px solid #d1d5db",

                                                background:
                                                    isSelected
                                                        ? "#eef2ff"
                                                        : "white",

                                                borderRadius: "10px",
                                                cursor: "pointer"
                                            }}
                                        >

                                            <input
                                                type="radio"
                                                name={question._id}
                                                value={option}
                                                checked={isSelected}
                                                onChange={() =>
                                                    handleAnswer(
                                                        question._id,
                                                        option
                                                    )
                                                }
                                            />

                                            <span
                                                style={{
                                                    fontWeight: "500"
                                                }}
                                            >
                                                {String.fromCharCode(
                                                    65 + index
                                                )}
                                                .{" "}
                                                {option}
                                            </span>

                                        </label>
                                    );
                                }
                            )}

                        </div>

                        {/* NAVIGATION */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                marginTop: "30px"
                            }}
                        >

                            <button
                                onClick={() =>
                                    goToQuestion(
                                        currentQuestion - 1
                                    )
                                }
                                disabled={
                                    currentQuestion === 0
                                }
                                style={{
                                    padding: "11px 20px",
                                    background: "#e5e7eb",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor:
                                        currentQuestion === 0
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >
                                ← Previous
                            </button>

                            <button
                                onClick={() =>
                                    goToQuestion(
                                        currentQuestion + 1
                                    )
                                }
                                disabled={
                                    currentQuestion ===
                                    questions.length - 1
                                }
                                style={{
                                    padding: "11px 20px",
                                    background: "#4f46e5",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor:
                                        currentQuestion ===
                                        questions.length - 1
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >
                                Next →
                            </button>

                        </div>

                    </div>

                    {/* ==========================================
                        QUESTION NAVIGATION
                    ========================================== */}

                    <div
                        style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "12px",
                            height: "fit-content",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.06)"
                        }}
                    >

                        <h3
                            style={{
                                marginBottom: "15px"
                            }}
                        >
                            Questions
                        </h3>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(4, 1fr)",
                                gap: "8px"
                            }}
                        >

                            {questions.map(
                                (item, index) => {

                                    const answered =
                                        answers[item._id];

                                    const current =
                                        currentQuestion === index;

                                    return (

                                        <button
                                            key={item._id}
                                            onClick={() =>
                                                goToQuestion(index)
                                            }
                                            style={{
                                                height: "42px",
                                                borderRadius: "8px",

                                                border:
                                                    current
                                                        ? "2px solid #4f46e5"
                                                        : "1px solid #d1d5db",

                                                background:
                                                    answered
                                                        ? "#dcfce7"
                                                        : "#f8fafc",

                                                fontWeight: "600",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {index + 1}
                                        </button>

                                    );
                                }
                            )}

                        </div>

                        {/* LEGEND */}

                        <div
                            style={{
                                marginTop: "20px",
                                fontSize: "13px",
                                color: "#6b7280"
                            }}
                        >

                            <p>
                                🟩 Answered
                            </p>

                            <p
                                style={{
                                    marginTop: "5px"
                                }}
                            >
                                ⬜ Not Answered
                            </p>

                        </div>

                        {/* UNANSWERED COUNT */}

                        {unansweredCount > 0 && (

                            <div
                                style={{
                                    marginTop: "15px",
                                    padding: "10px",
                                    background: "#fff7ed",
                                    color: "#c2410c",
                                    borderRadius: "8px",
                                    fontSize: "13px"
                                }}
                            >
                                {unansweredCount} unanswered
                                question
                                {unansweredCount > 1
                                    ? "s"
                                    : ""}
                            </div>

                        )}

                        {/* SUBMIT */}

                        <button
                            onClick={() =>
                                submitTest(false)
                            }
                            disabled={submitting}
                            style={{
                                width: "100%",
                                padding: "13px",
                                marginTop: "25px",
                                background: "#16a34a",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                fontSize: "15px",
                                cursor: submitting
                                    ? "not-allowed"
                                    : "pointer"
                            }}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Test"}
                        </button>

                        {/* MESSAGE */}

                        {message && (

                            <p
                                style={{
                                    marginTop: "12px",
                                    color: "#b91c1c",
                                    fontSize: "14px"
                                }}
                            >
                                {message}
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AttemptTest;