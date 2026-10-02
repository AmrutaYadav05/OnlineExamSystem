import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function AddQuestion() {
    const { testId } = useParams();
    const navigate = useNavigate();

    // ==========================================
    // TEST DATA
    // ==========================================

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);

    // ==========================================
    // FORM DATA
    // ==========================================

    const [questionText, setQuestionText] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [marks, setMarks] = useState(1);

    // ==========================================
    // UI STATES
    // ==========================================

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingQuestions, setLoadingQuestions] = useState(true);

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
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setTest(data.test);
            } else {
                setMessage(
                    data.message || "Unable to load test"
                );
            }
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    // ==========================================
    // LOAD QUESTIONS
    // ==========================================

    const loadQuestions = async () => {
        try {
            setLoadingQuestions(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/questions/test/${testId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setQuestions(data.questions || []);
            } else {
                setMessage(
                    data.message || "Unable to load questions"
                );
            }
        } catch (error) {
            console.error(
                "Error loading questions:",
                error
            );

            setMessage("Unable to connect to server");
        } finally {
            setLoadingQuestions(false);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        loadTest();
        loadQuestions();
    }, [testId]);

    // ==========================================
    // SUBMIT QUESTION
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        const options = [
            option1,
            option2,
            option3,
            option4,
        ];

        try {
            const token = localStorage.getItem("token");

            let url;
            let method;

            if (editingId) {
                url = `${API_URL}/questions/${editingId}`;
                method = "PUT";
            } else {
                url = `${API_URL}/questions`;
                method = "POST";
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    test: testId,
                    questionText,
                    options,
                    correctAnswer,
                    marks: Number(marks),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Operation failed"
                );
                return;
            }

            if (editingId) {
                setMessage(
                    "Question updated successfully!"
                );
            } else {
                setMessage(
                    "Question added successfully!"
                );
            }

            clearForm();

            await loadQuestions();
            await loadTest();
        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // CLEAR FORM
    // ==========================================

    const clearForm = () => {
        setQuestionText("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setCorrectAnswer("");
        setMarks(1);
        setEditingId(null);
    };

    // ==========================================
    // EDIT QUESTION
    // ==========================================

    const handleEdit = (question) => {
        setEditingId(question._id);

        setQuestionText(
            question.questionText
        );

        setOption1(
            question.options[0] || ""
        );

        setOption2(
            question.options[1] || ""
        );

        setOption3(
            question.options[2] || ""
        );

        setOption4(
            question.options[3] || ""
        );

        setCorrectAnswer(
            question.correctAnswer
        );

        setMarks(question.marks);

        setMessage("Editing question...");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // DELETE QUESTION
    // ==========================================

    const handleDelete = async (questionId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this question?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/questions/${questionId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                        "Failed to delete question"
                );
                return;
            }

            setMessage(
                "Question deleted successfully!"
            );

            await loadQuestions();
            await loadTest();
        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to connect to server"
            );
        }
    };

    // ==========================================
    // TOTAL MARKS
    // ==========================================

    const calculateTotalMarks = () => {
        return questions.reduce(
            (total, question) =>
                total +
                Number(question.marks || 0),
            0
        );
    };

    // ==========================================
    // INPUT STYLE
    // ==========================================

    const inputStyle = {
        width: "100%",
        padding: "12px 14px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
        marginTop: "7px",
    };

    const labelStyle = {
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
    };

    // ==========================================
    // RETURN UI
    // ==========================================

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "30px 20px 50px",
                color: "#1f2937",
            }}
        >
            {/* ================================= */}
            {/* PAGE HEADER */}
            {/* ================================= */}

            <div
                style={{
                    marginBottom: "25px",
                }}
            >
                <button
                    onClick={() =>
                        navigate("/admin-dashboard")
                    }
                    style={{
                        border: "none",
                        background: "transparent",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: "0",
                        marginBottom: "12px",
                    }}
                >
                    ← Back to Admin Dashboard
                </button>

                <h1
                    style={{
                        margin: "0 0 8px",
                        fontSize: "30px",
                    }}
                >
                    Question Management
                </h1>

                <p
                    style={{
                        margin: 0,
                        color: "#6b7280",
                    }}
                >
                    Add, edit and manage questions
                    for your test.
                </p>
            </div>

            {/* ================================= */}
            {/* TEST INFORMATION */}
            {/* ================================= */}

            {test && (
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "22px",
                        marginBottom: "25px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "flex-start",
                            gap: "20px",
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    margin: "0 0 6px",
                                    fontSize: "13px",
                                    color: "#6b7280",
                                    fontWeight: "600",
                                }}
                            >
                                TEST
                            </p>

                            <h2
                                style={{
                                    margin: "0 0 8px",
                                    fontSize: "22px",
                                }}
                            >
                                {test.title}
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#6b7280",
                                }}
                            >
                                {test.description}
                            </p>
                        </div>

                        <div
                            style={{
                                background: "#f3f4f6",
                                padding:
                                    "10px 16px",
                                borderRadius: "8px",
                                whiteSpace:
                                    "nowrap",
                            }}
                        >
                            <span
                                style={{
                                    color: "#6b7280",
                                    fontSize: "14px",
                                }}
                            >
                                Duration
                            </span>

                            <strong
                                style={{
                                    display:
                                        "block",
                                    marginTop: "3px",
                                }}
                            >
                                {test.duration} minutes
                            </strong>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================= */}
            {/* SUMMARY CARDS */}
            {/* ================================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "18px",
                    marginBottom: "28px",
                }}
            >
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "22px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                >
                    <p
                        style={{
                            margin: "0 0 8px",
                            color: "#6b7280",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        TOTAL QUESTIONS
                    </p>

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "30px",
                        }}
                    >
                        {questions.length}
                    </h2>
                </div>

                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "22px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                >
                    <p
                        style={{
                            margin: "0 0 8px",
                            color: "#6b7280",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        TOTAL MARKS
                    </p>

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "30px",
                        }}
                    >
                        {calculateTotalMarks()}
                    </h2>
                </div>
            </div>

            {/* ================================= */}
            {/* MESSAGE */}
            {/* ================================= */}

            {message && (
                <div
                    style={{
                        padding: "12px 15px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        background:
                            message.includes(
                                "successfully"
                            )
                                ? "#ecfdf5"
                                : "#eff6ff",
                        color:
                            message.includes(
                                "successfully"
                            )
                                ? "#047857"
                                : "#1d4ed8",
                        border: "1px solid #d1fae5",
                        fontSize: "14px",
                    }}
                >
                    {message}
                </div>
            )}

            {/* ================================= */}
            {/* ADD / EDIT FORM */}
            {/* ================================= */}

            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "25px",
                    marginBottom: "30px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.04)",
                }}
            >
                <div
                    style={{
                        marginBottom: "22px",
                    }}
                >
                    <h2
                        style={{
                            margin: "0 0 6px",
                            fontSize: "21px",
                        }}
                    >
                        {editingId
                            ? "Edit Question"
                            : "Add New Question"}
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color: "#6b7280",
                            fontSize: "14px",
                        }}
                    >
                        {editingId
                            ? "Update the question details below."
                            : "Enter the question and its four options."}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* QUESTION */}

                    <div
                        style={{
                            marginBottom: "20px",
                        }}
                    >
                        <label style={labelStyle}>
                            Question
                        </label>

                        <textarea
                            value={questionText}
                            onChange={(e) =>
                                setQuestionText(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your question"
                            rows="4"
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                            }}
                            required
                        />
                    </div>

                    {/* OPTIONS */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "18px",
                            marginBottom: "20px",
                        }}
                    >
                        <div>
                            <label style={labelStyle}>
                                Option A
                            </label>

                            <input
                                type="text"
                                value={option1}
                                onChange={(e) =>
                                    setOption1(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter option A"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Option B
                            </label>

                            <input
                                type="text"
                                value={option2}
                                onChange={(e) =>
                                    setOption2(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter option B"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Option C
                            </label>

                            <input
                                type="text"
                                value={option3}
                                onChange={(e) =>
                                    setOption3(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter option C"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Option D
                            </label>

                            <input
                                type="text"
                                value={option4}
                                onChange={(e) =>
                                    setOption4(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter option D"
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    {/* CORRECT ANSWER + MARKS */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "2fr 1fr",
                            gap: "18px",
                            marginBottom: "25px",
                        }}
                    >
                        <div>
                            <label style={labelStyle}>
                                Correct Answer
                            </label>

                            <select
                                value={
                                    correctAnswer
                                }
                                onChange={(e) =>
                                    setCorrectAnswer(
                                        e.target.value
                                    )
                                }
                                style={inputStyle}
                                required
                            >
                                <option value="">
                                    Select correct answer
                                </option>

                                <option value={option1}>
                                    {option1 ||
                                        "Option A"}
                                </option>

                                <option value={option2}>
                                    {option2 ||
                                        "Option B"}
                                </option>

                                <option value={option3}>
                                    {option3 ||
                                        "Option C"}
                                </option>

                                <option value={option4}>
                                    {option4 ||
                                        "Option D"}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Marks
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={marks}
                                onChange={(e) =>
                                    setMarks(
                                        e.target.value
                                    )
                                }
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    {/* BUTTONS */}

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding:
                                    "11px 20px",
                                border: "none",
                                borderRadius: "8px",
                                background:
                                    "#2563eb",
                                color: "#ffffff",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: loading
                                    ? 0.7
                                    : 1,
                            }}
                        >
                            {loading
                                ? "Saving..."
                                : editingId
                                ? "Update Question"
                                : "Add Question"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    clearForm();
                                    setMessage("");
                                }}
                                style={{
                                    padding:
                                        "11px 20px",
                                    border: "1px solid #d1d5db",
                                    borderRadius:
                                        "8px",
                                    background:
                                        "#ffffff",
                                    color: "#374151",
                                    fontSize:
                                        "14px",
                                    fontWeight:
                                        "600",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* ================================= */}
            {/* QUESTION LIST */}
            {/* ================================= */}

            <div
                style={{
                    marginBottom: "20px",
                }}
            >
                <h2
                    style={{
                        margin: "0 0 6px",
                        fontSize: "22px",
                    }}
                >
                    All Questions
                </h2>

                <p
                    style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "14px",
                    }}
                >
                    Manage all questions added to
                    this test.
                </p>
            </div>

            {loadingQuestions && (
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "25px",
                        textAlign: "center",
                        color: "#6b7280",
                    }}
                >
                    Loading questions...
                </div>
            )}

            {!loadingQuestions &&
                questions.length === 0 && (
                    <div
                        style={{
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            padding: "35px",
                            textAlign: "center",
                            color: "#6b7280",
                        }}
                    >
                        <h3
                            style={{
                                margin:
                                    "0 0 8px",
                                color: "#374151",
                            }}
                        >
                            No questions yet
                        </h3>

                        <p
                            style={{
                                margin: 0,
                            }}
                        >
                            Add your first question
                            using the form above.
                        </p>
                    </div>
                )}

            {!loadingQuestions &&
                questions.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "18px",
                        }}
                    >
                        {questions.map(
                            (question, index) => (
                                <div
                                    key={
                                        question._id
                                    }
                                    style={{
                                        background:
                                            "#ffffff",
                                        border:
                                            "1px solid #e5e7eb",
                                        borderRadius:
                                            "12px",
                                        padding:
                                            "22px",
                                        boxShadow:
                                            "0 2px 8px rgba(0,0,0,0.04)",
                                    }}
                                >
                                    {/* QUESTION HEADER */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            gap: "10px",
                                            marginBottom:
                                                "15px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                background:
                                                    "#eff6ff",
                                                color:
                                                    "#2563eb",
                                                padding:
                                                    "6px 10px",
                                                borderRadius:
                                                    "6px",
                                                fontSize:
                                                    "13px",
                                                fontWeight:
                                                    "600",
                                            }}
                                        >
                                            Question{" "}
                                            {index +
                                                1}
                                        </span>

                                        <span
                                            style={{
                                                color:
                                                    "#6b7280",
                                                fontSize:
                                                    "14px",
                                            }}
                                        >
                                            {
                                                question.marks
                                            }{" "}
                                            mark
                                            {question.marks !==
                                            1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>

                                    {/* QUESTION TEXT */}

                                    <h3
                                        style={{
                                            margin:
                                                "0 0 18px",
                                            fontSize:
                                                "17px",
                                            lineHeight:
                                                "1.5",
                                            color:
                                                "#111827",
                                        }}
                                    >
                                        {
                                            question.questionText
                                        }
                                    </h3>

                                    {/* OPTIONS */}

                                    <div
                                        style={{
                                            display:
                                                "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fit, minmax(250px, 1fr))",
                                            gap: "10px",
                                            marginBottom:
                                                "18px",
                                        }}
                                    >
                                        {question.options.map(
                                            (
                                                option,
                                                optionIndex
                                            ) => {
                                                const isCorrect =
                                                    option ===
                                                    question.correctAnswer;

                                                return (
                                                    <div
                                                        key={
                                                            optionIndex
                                                        }
                                                        style={{
                                                            padding:
                                                                "11px 13px",
                                                            border:
                                                                isCorrect
                                                                    ? "1px solid #86efac"
                                                                    : "1px solid #e5e7eb",
                                                            background:
                                                                isCorrect
                                                                    ? "#f0fdf4"
                                                                    : "#f9fafb",
                                                            borderRadius:
                                                                "8px",
                                                            fontSize:
                                                                "14px",
                                                            color:
                                                                "#374151",
                                                        }}
                                                    >
                                                        <strong
                                                            style={{
                                                                marginRight:
                                                                    "8px",
                                                            }}
                                                        >
                                                            {String.fromCharCode(
                                                                65 +
                                                                    optionIndex
                                                            )}
                                                            .
                                                        </strong>

                                                        {
                                                            option
                                                        }

                                                        {isCorrect && (
                                                            <span
                                                                style={{
                                                                    float:
                                                                        "right",
                                                                    color:
                                                                        "#15803d",
                                                                    fontSize:
                                                                        "12px",
                                                                    fontWeight:
                                                                        "600",
                                                                }}
                                                            >
                                                                Correct
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>

                                    {/* CORRECT ANSWER */}

                                    <div
                                        style={{
                                            padding:
                                                "11px 13px",
                                            background:
                                                "#f0fdf4",
                                            borderRadius:
                                                "8px",
                                            marginBottom:
                                                "18px",
                                            fontSize:
                                                "14px",
                                        }}
                                    >
                                        <strong>
                                            Correct Answer:
                                        </strong>{" "}
                                        {
                                            question.correctAnswer
                                        }
                                    </div>

                                    {/* ACTIONS */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap: "10px",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    question
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "9px 16px",
                                                border:
                                                    "1px solid #2563eb",
                                                borderRadius:
                                                    "7px",
                                                background:
                                                    "#ffffff",
                                                color:
                                                    "#2563eb",
                                                fontWeight:
                                                    "600",
                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    question._id
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "9px 16px",
                                                border:
                                                    "1px solid #dc2626",
                                                borderRadius:
                                                    "7px",
                                                background:
                                                    "#ffffff",
                                                color:
                                                    "#dc2626",
                                                fontWeight:
                                                    "600",
                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}

            {/* ================================= */}
            {/* BOTTOM BACK BUTTON */}
            {/* ================================= */}

            <div
                style={{
                    marginTop: "30px",
                    textAlign: "center",
                }}
            >
                <button
                    onClick={() =>
                        navigate("/admin-dashboard")
                    }
                    style={{
                        padding: "11px 20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        background: "#ffffff",
                        color: "#374151",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                    }}
                >
                    ← Back to Admin Dashboard
                </button>
            </div>
        </div>
    );
}

export default AddQuestion;