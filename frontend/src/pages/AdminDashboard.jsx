import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const navigate = useNavigate();

    // ==========================================
    // TEST FORM
    // ==========================================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");

    // ==========================================
    // DATA
    // ==========================================

    const [tests, setTests] = useState([]);
    const [results, setResults] = useState([]);

    // ==========================================
    // UI STATES
    // ==========================================

    const [editingTestId, setEditingTestId] =
        useState(null);

    const [selectedTestId, setSelectedTestId] =
        useState(null);

    const [message, setMessage] = useState("");
    const [resultMessage, setResultMessage] =
        useState("");

    const [loading, setLoading] = useState(false);
    const [loadingResults, setLoadingResults] =
        useState(true);

    // ==========================================
    // LOAD TESTS
    // ==========================================

    const loadTests = async () => {
        try {
            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/tests`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setTests(data.tests || []);
            } else {
                setMessage(
                    data.message ||
                        "Unable to load tests"
                );
            }
        } catch (error) {
            console.error(
                "Error loading tests:",
                error
            );

            setMessage(
                "Unable to connect to server"
            );
        }
    };

    // ==========================================
    // LOAD ALL RESULTS
    // ==========================================

    const loadResults = async () => {
        try {
            setLoadingResults(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/results/all`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (
                response.ok &&
                data.results
            ) {
                setResults(data.results);
                setResultMessage("");
            } else {
                setResultMessage(
                    data.message ||
                        "Unable to load results"
                );
            }
        } catch (error) {
            console.error(
                "Error loading results:",
                error
            );

            setResultMessage(
                "Unable to connect to server"
            );
        } finally {
            setLoadingResults(false);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        loadTests();
        loadResults();
    }, []);

    // ==========================================
    // CREATE / UPDATE TEST
    // ==========================================

    const handleSubmitTest = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const token =
                localStorage.getItem("token");

            let url;
            let method;

            if (editingTestId) {
                url =
                    `${API_URL}/tests/${editingTestId}`;
                method = "PUT";
            } else {
                url = `${API_URL}/tests`;
                method = "POST";
            }

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        duration:
                            Number(duration),
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                        "Operation failed"
                );
                return;
            }

            if (editingTestId) {
                setMessage(
                    "Test updated successfully!"
                );
            } else {
                setMessage(
                    "Test created successfully!"
                );
            }

            clearTestForm();

            await loadTests();
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
    // EDIT TEST
    // ==========================================

    const handleEditTest = (test) => {
        setEditingTestId(test._id);

        setTitle(test.title);
        setDescription(
            test.description
        );
        setDuration(test.duration);

        setMessage("Editing test...");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // DELETE TEST
    // ==========================================

    const handleDeleteTest = async (
        testId
    ) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this test? All questions of this test will also be deleted."
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/tests/${testId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                        "Failed to delete test"
                );
                return;
            }

            setMessage(
                "Test deleted successfully!"
            );

            if (
                selectedTestId === testId
            ) {
                setSelectedTestId(null);
            }

            await loadTests();
            await loadResults();
        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to connect to server"
            );
        }
    };

    // ==========================================
    // CLEAR FORM
    // ==========================================

    const clearTestForm = () => {
        setTitle("");
        setDescription("");
        setDuration("");
        setEditingTestId(null);
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ==========================================
    // SELECT TEST
    // ==========================================

    const handleSelectTest = (testId) => {
        if (selectedTestId === testId) {
            setSelectedTestId(null);
        } else {
            setSelectedTestId(testId);
        }
    };

    // ==========================================
    // GET RESULTS FOR SELECTED TEST
    // ==========================================

    const selectedTestResults =
        results.filter(
            (result) =>
                result.test?._id ===
                selectedTestId
        );

    const selectedTest = tests.find(
        (test) =>
            test._id === selectedTestId
    );

    // ==========================================
    // STYLES
    // ==========================================

    const inputStyle = {
        width: "100%",
        maxWidth: "700px",
        padding: "12px",
        marginTop: "7px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        boxSizing: "border-box",
        fontSize: "14px",
    };

    const primaryButton = {
        padding: "11px 18px",
        background: "#4f46e5",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
    };

    const secondaryButton = {
        padding: "10px 15px",
        background: "#e5e7eb",
        color: "#374151",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
    };

    // ==========================================
    // RETURN
    // ==========================================

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f9",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "35px 25px 60px",
                }}
            >
                {/* ================================= */}
                {/* WELCOME */}
                {/* ================================= */}

                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "14px",
                        marginBottom: "30px",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)",
                    }}
                >
                    <h1
                        style={{
                            margin:
                                "0 0 8px",
                        }}
                    >
                        Admin Dashboard
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            margin:
                                "0 0 5px",
                        }}
                    >
                        Welcome,{" "}
                        {user?.name} 👋
                    </p>

                    <p
                        style={{
                            color: "#6b7280",
                            margin: 0,
                        }}
                    >
                        {user?.email}
                    </p>
                </div>

                {/* ================================= */}
                {/* CREATE / EDIT TEST */}
                {/* ================================= */}

                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "14px",
                        marginBottom: "35px",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)",
                    }}
                >
                    <h2
                        style={{
                            margin:
                                "0 0 20px",
                        }}
                    >
                        {editingTestId
                            ? "Edit Test"
                            : "Create New Test"}
                    </h2>

                    <form
                        onSubmit={
                            handleSubmitTest
                        }
                    >
                        {/* TITLE */}

                        <div
                            style={{
                                marginBottom:
                                    "18px",
                            }}
                        >
                            <label>
                                <strong>
                                    Test Title
                                </strong>
                            </label>

                            <br />

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="Enter test title"
                                required
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        {/* DESCRIPTION */}

                        <div
                            style={{
                                marginBottom:
                                    "18px",
                            }}
                        >
                            <label>
                                <strong>
                                    Description
                                </strong>
                            </label>

                            <br />

                            <textarea
                                value={
                                    description
                                }
                                onChange={(e) =>
                                    setDescription(
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="Enter test description"
                                rows="4"
                                required
                                style={{
                                    ...inputStyle,
                                    resize:
                                        "vertical",
                                }}
                            />
                        </div>

                        {/* DURATION */}

                        <div
                            style={{
                                marginBottom:
                                    "20px",
                            }}
                        >
                            <label>
                                <strong>
                                    Duration
                                </strong>
                            </label>

                            <br />

                            <input
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) =>
                                    setDuration(
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="Minutes"
                                required
                                style={{
                                    width:
                                        "180px",
                                    padding:
                                        "12px",
                                    marginTop:
                                        "7px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius:
                                        "8px",
                                }}
                            />

                            <span
                                style={{
                                    marginLeft:
                                        "10px",
                                    color:
                                        "#6b7280",
                                }}
                            >
                                minutes
                            </span>
                        </div>

                        {/* BUTTONS */}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...primaryButton,
                                opacity:
                                    loading
                                        ? 0.7
                                        : 1,
                            }}
                        >
                            {loading
                                ? "Saving..."
                                : editingTestId
                                ? "Update Test"
                                : "Create Test"}
                        </button>

                        {editingTestId && (
                            <button
                                type="button"
                                onClick={() => {
                                    clearTestForm();
                                    setMessage(
                                        ""
                                    );
                                }}
                                style={{
                                    ...secondaryButton,
                                    marginLeft:
                                        "10px",
                                }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>

                    {message && (
                        <p
                            style={{
                                marginTop:
                                    "18px",
                                padding:
                                    "12px",
                                background:
                                    "#eef2ff",
                                color:
                                    "#3730a3",
                                borderRadius:
                                    "8px",
                            }}
                        >
                            {message}
                        </p>
                    )}
                </div>

                {/* ================================= */}
                {/* MANAGE TESTS */}
                {/* ================================= */}

                <div>
                    <h2
                        style={{
                            margin:
                                "0 0 8px",
                        }}
                    >
                        Manage Tests
                    </h2>

                    <p
                        style={{
                            color:
                                "#6b7280",
                            margin:
                                "0 0 20px",
                        }}
                    >
                        Select a test to view
                        the marks of students
                        who attempted it.
                    </p>

                    {tests.length === 0 && (
                        <div
                            style={{
                                background:
                                    "white",
                                padding:
                                    "30px",
                                borderRadius:
                                    "12px",
                            }}
                        >
                            No tests found.
                        </div>
                    )}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {tests.map(
                            (test) => {
                                const testResultCount =
                                    results.filter(
                                        (
                                            result
                                        ) =>
                                            result
                                                .test
                                                ?._id ===
                                            test._id
                                    ).length;

                                const isSelected =
                                    selectedTestId ===
                                    test._id;

                                return (
                                    <div
                                        key={
                                            test._id
                                        }
                                        style={{
                                            background:
                                                "white",
                                            padding:
                                                "25px",
                                            borderRadius:
                                                "14px",
                                            boxShadow:
                                                isSelected
                                                    ? "0 0 0 2px #4f46e5"
                                                    : "0 4px 15px rgba(0,0,0,0.06)",
                                            transition:
                                                "0.2s",
                                        }}
                                    >
                                        {/* TEST TITLE */}

                                        <h3
                                            style={{
                                                margin:
                                                    "0 0 10px",
                                                fontSize:
                                                    "20px",
                                            }}
                                        >
                                            {
                                                test.title
                                            }
                                        </h3>

                                        <p
                                            style={{
                                                color:
                                                    "#6b7280",
                                                lineHeight:
                                                    "1.5",
                                                minHeight:
                                                    "45px",
                                            }}
                                        >
                                            {
                                                test.description
                                            }
                                        </p>

                                        <hr
                                            style={{
                                                margin:
                                                    "18px 0",
                                                border:
                                                    "none",
                                                borderTop:
                                                    "1px solid #e5e7eb",
                                            }}
                                        />

                                        {/* TEST INFO */}

                                        <div
                                            style={{
                                                display:
                                                    "grid",
                                                gridTemplateColumns:
                                                    "1fr 1fr",
                                                gap:
                                                    "10px",
                                                marginBottom:
                                                    "12px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    background:
                                                        "#f8fafc",
                                                    padding:
                                                        "12px",
                                                    borderRadius:
                                                        "8px",
                                                }}
                                            >
                                                <small
                                                    style={{
                                                        color:
                                                            "#6b7280",
                                                    }}
                                                >
                                                    Duration
                                                </small>

                                                <strong
                                                    style={{
                                                        display:
                                                            "block",
                                                        marginTop:
                                                            "4px",
                                                    }}
                                                >
                                                    {
                                                        test.duration
                                                    }{" "}
                                                    min
                                                </strong>
                                            </div>

                                            <div
                                                style={{
                                                    background:
                                                        "#f8fafc",
                                                    padding:
                                                        "12px",
                                                    borderRadius:
                                                        "8px",
                                                }}
                                            >
                                                <small
                                                    style={{
                                                        color:
                                                            "#6b7280",
                                                    }}
                                                >
                                                    Questions
                                                </small>

                                                <strong
                                                    style={{
                                                        display:
                                                            "block",
                                                        marginTop:
                                                            "4px",
                                                    }}
                                                >
                                                    {
                                                        test.questionCount
                                                    }
                                                </strong>
                                            </div>
                                        </div>

                                        {/* TOTAL MARKS */}

                                        <div
                                            style={{
                                                background:
                                                    "#f8fafc",
                                                padding:
                                                    "12px",
                                                borderRadius:
                                                    "8px",
                                                marginBottom:
                                                    "15px",
                                            }}
                                        >
                                            <small
                                                style={{
                                                    color:
                                                        "#6b7280",
                                                }}
                                            >
                                                Total Marks
                                            </small>

                                            <strong
                                                style={{
                                                    display:
                                                        "block",
                                                    marginTop:
                                                        "4px",
                                                }}
                                            >
                                                {
                                                    test.totalMarks
                                                }
                                            </strong>
                                        </div>

                                        {/* ATTEMPTS */}

                                        <div
                                            style={{
                                                background:
                                                    "#eef2ff",
                                                padding:
                                                    "12px",
                                                borderRadius:
                                                    "8px",
                                                marginBottom:
                                                    "18px",
                                                color:
                                                    "#3730a3",
                                            }}
                                        >
                                            <strong>
                                                {
                                                    testResultCount
                                                }
                                            </strong>{" "}
                                            student
                                            {testResultCount !==
                                            1
                                                ? "s"
                                                : ""}{" "}
                                            attempted
                                            this test
                                        </div>

                                        {/* VIEW MARKS */}

                                        <button
                                            onClick={() =>
                                                handleSelectTest(
                                                    test._id
                                                )
                                            }
                                            style={{
                                                width:
                                                    "100%",
                                                padding:
                                                    "11px",
                                                background:
                                                    isSelected
                                                        ? "#3730a3"
                                                        : "#4f46e5",
                                                color:
                                                    "white",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "8px",
                                                fontWeight:
                                                    "600",
                                                cursor:
                                                    "pointer",
                                                marginBottom:
                                                    "10px",
                                            }}
                                        >
                                            {isSelected
                                                ? "Hide Student Marks"
                                                : "View Student Marks"}
                                        </button>

                                        {/* MANAGE QUESTIONS */}

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/add-question/${test._id}`
                                                )
                                            }
                                            style={{
                                                width:
                                                    "100%",
                                                padding:
                                                    "10px",
                                                background:
                                                    "#4f46e5",
                                                color:
                                                    "white",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "8px",
                                                fontWeight:
                                                    "600",
                                                cursor:
                                                    "pointer",
                                                marginBottom:
                                                    "10px",
                                            }}
                                        >
                                            Manage Questions
                                        </button>

                                        {/* EDIT */}

                                        <button
                                            onClick={() =>
                                                handleEditTest(
                                                    test
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "10px 15px",
                                                background:
                                                    "#e5e7eb",
                                                color:
                                                    "#374151",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "8px",
                                                fontWeight:
                                                    "600",
                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            Edit Test
                                        </button>

                                        {/* DELETE */}

                                        <button
                                            onClick={() =>
                                                handleDeleteTest(
                                                    test._id
                                                )
                                            }
                                            style={{
                                                marginLeft:
                                                    "10px",
                                                padding:
                                                    "10px 15px",
                                                background:
                                                    "#fee2e2",
                                                color:
                                                    "#b91c1c",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "8px",
                                                fontWeight:
                                                    "600",
                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* ================================= */}
                {/* SELECTED TEST STUDENT MARKS */}
                {/* ================================= */}

                {selectedTestId && (
                    <div
                        style={{
                            marginTop: "40px",
                            background:
                                "white",
                            padding: "30px",
                            borderRadius:
                                "14px",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.06)",
                        }}
                    >
                        {/* HEADER */}

                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                gap: "15px",
                                flexWrap:
                                    "wrap",
                                marginBottom:
                                    "25px",
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        margin:
                                            "0 0 5px",
                                        color:
                                            "#6b7280",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    STUDENT RESULTS
                                </p>

                                <h2
                                    style={{
                                        margin:
                                            "0 0 6px",
                                    }}
                                >
                                    {selectedTest
                                        ?.title ||
                                        "Test"}{" "}
                                    - Student Marks
                                </h2>

                                <p
                                    style={{
                                        margin: 0,
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    Marks of students
                                    who attempted
                                    this test.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedTestId(
                                        null
                                    )
                                }
                                style={{
                                    ...secondaryButton,
                                }}
                            >
                                Close
                            </button>
                        </div>

                        {/* LOADING */}

                        {loadingResults && (
                            <div
                                style={{
                                    padding:
                                        "25px",
                                    textAlign:
                                        "center",
                                    color:
                                        "#6b7280",
                                }}
                            >
                                Loading student
                                results...
                            </div>
                        )}

                        {/* ERROR */}

                        {!loadingResults &&
                            resultMessage && (
                                <div
                                    style={{
                                        background:
                                            "#fee2e2",
                                        color:
                                            "#b91c1c",
                                        padding:
                                            "15px",
                                        borderRadius:
                                            "8px",
                                    }}
                                >
                                    {
                                        resultMessage
                                    }
                                </div>
                            )}

                        {/* NO RESULTS */}

                        {!loadingResults &&
                            !resultMessage &&
                            selectedTestResults.length ===
                                0 && (
                                <div
                                    style={{
                                        padding:
                                            "35px",
                                        textAlign:
                                            "center",
                                        background:
                                            "#f8fafc",
                                        borderRadius:
                                            "10px",
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin:
                                                "0 0 8px",
                                            color:
                                                "#374151",
                                        }}
                                    >
                                        No students have
                                        attempted this
                                        test yet.
                                    </h3>

                                    <p
                                        style={{
                                            margin: 0,
                                        }}
                                    >
                                        Student marks
                                        will appear here
                                        after they
                                        complete the
                                        test.
                                    </p>
                                </div>
                            )}

                        {/* RESULTS */}

                        {!loadingResults &&
                            !resultMessage &&
                            selectedTestResults.length >
                                0 && (
                                <div
                                    style={{
                                        overflowX:
                                            "auto",
                                    }}
                                >
                                    <table
                                        style={{
                                            width:
                                                "100%",
                                            borderCollapse:
                                                "collapse",
                                        }}
                                    >
                                        <thead>
                                            <tr
                                                style={{
                                                    background:
                                                        "#f8fafc",
                                                }}
                                            >
                                                <th
                                                    style={{
                                                        textAlign:
                                                            "left",
                                                        padding:
                                                            "14px",
                                                        borderBottom:
                                                            "1px solid #e5e7eb",
                                                    }}
                                                >
                                                    #
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "left",
                                                        padding:
                                                            "14px",
                                                        borderBottom:
                                                            "1px solid #e5e7eb",
                                                    }}
                                                >
                                                    Student
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "left",
                                                        padding:
                                                            "14px",
                                                        borderBottom:
                                                            "1px solid #e5e7eb",
                                                    }}
                                                >
                                                    Email
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "center",
                                                        padding:
                                                            "14px",
                                                        borderBottom:
                                                            "1px solid #e5e7eb",
                                                    }}
                                                >
                                                    Marks
                                                </th>

                                                <th
                                                    style={{
                                                        textAlign:
                                                            "center",
                                                        padding:
                                                            "14px",
                                                        borderBottom:
                                                            "1px solid #e5e7eb",
                                                    }}
                                                >
                                                    Attempted On
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {selectedTestResults.map(
                                                (
                                                    result,
                                                    index
                                                ) => (
                                                    <tr
                                                        key={
                                                            result._id
                                                        }
                                                    >
                                                        <td
                                                            style={{
                                                                padding:
                                                                    "15px 14px",
                                                                borderBottom:
                                                                    "1px solid #f1f5f9",
                                                                color:
                                                                    "#6b7280",
                                                            }}
                                                        >
                                                            {
                                                                index +
                                                                1
                                                            }
                                                        </td>

                                                        <td
                                                            style={{
                                                                padding:
                                                                    "15px 14px",
                                                                borderBottom:
                                                                    "1px solid #f1f5f9",
                                                            }}
                                                        >
                                                            <strong>
                                                                {
                                                                    result
                                                                        .student
                                                                        ?.name
                                                                }
                                                            </strong>
                                                        </td>

                                                        <td
                                                            style={{
                                                                padding:
                                                                    "15px 14px",
                                                                borderBottom:
                                                                    "1px solid #f1f5f9",
                                                                color:
                                                                    "#6b7280",
                                                            }}
                                                        >
                                                            {
                                                                result
                                                                    .student
                                                                    ?.email
                                                            }
                                                        </td>

                                                        <td
                                                            style={{
                                                                padding:
                                                                    "15px 14px",
                                                                borderBottom:
                                                                    "1px solid #f1f5f9",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display:
                                                                        "inline-block",
                                                                    padding:
                                                                        "7px 13px",
                                                                    borderRadius:
                                                                        "7px",
                                                                    background:
                                                                        "#eef2ff",
                                                                    color:
                                                                        "#4338ca",
                                                                    fontWeight:
                                                                        "700",
                                                                }}
                                                            >
                                                                {
                                                                    result.score
                                                                }{" "}
                                                                /{" "}
                                                                {
                                                                    result.totalMarks
                                                                }
                                                            </span>
                                                        </td>

                                                        <td
                                                            style={{
                                                                padding:
                                                                    "15px 14px",
                                                                borderBottom:
                                                                    "1px solid #f1f5f9",
                                                                textAlign:
                                                                    "center",
                                                                color:
                                                                    "#6b7280",
                                                            }}
                                                        >
                                                            {formatDate(
                                                                result.createdAt
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;