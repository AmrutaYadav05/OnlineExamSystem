import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const navigate = useNavigate();

    // ==========================================
    // TEST FORM
    // ==========================================

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [duration, setDuration] =
        useState("");

    // ==========================================
    // DATA
    // ==========================================

    const [tests, setTests] =
        useState([]);

    const [results, setResults] =
        useState([]);

    // ==========================================
    // UI STATES
    // ==========================================

    const [editingTestId, setEditingTestId] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [resultMessage, setResultMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [loadingResults, setLoadingResults] =
        useState(true);


    // ==========================================
    // LOAD TESTS
    // ==========================================

    const loadTests = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/tests`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const data =
                await response.json();

            if (response.ok) {

                setTests(
                    data.tests || []
                );

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
    // LOAD RESULTS
    // ==========================================

    const loadResults = async () => {

        try {

            setLoadingResults(true);

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/results/all`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const data =
                await response.json();

            if (
                response.ok &&
                data.results
            ) {

                setResults(
                    data.results
                );

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

                url =
                    `${API_URL}/tests`;

                method = "POST";

            }


            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify({
                                title,
                                description,
                                duration:
                                    Number(duration)
                            })
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

        setEditingTestId(
            test._id
        );

        setTitle(
            test.title
        );

        setDescription(
            test.description
        );

        setDuration(
            test.duration
        );

        setMessage(
            "Editing test..."
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // DELETE TEST
    // ==========================================

    const handleDeleteTest = async (testId) => {

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


            const response =
                await fetch(
                    `${API_URL}/tests/${testId}`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
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


            await loadTests();

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

        return new Date(date)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

    };


    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f9"
            }}
        >

            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "35px 25px"
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
                            "0 4px 15px rgba(0,0,0,0.06)"
                    }}
                >

                    <h1
                        style={{
                            marginBottom: "8px"
                        }}
                    >
                        Admin Dashboard
                    </h1>

                    <p
                        style={{
                            color: "#6b7280"
                        }}
                    >
                        Welcome, {user?.name} 👋
                    </p>

                    <p
                        style={{
                            color: "#6b7280",
                            marginTop: "5px"
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
                        marginBottom: "30px",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "20px"
                        }}
                    >
                        {editingTestId
                            ? "Edit Test"
                            : "Create New Test"
                        }
                    </h2>


                    <form
                        onSubmit={
                            handleSubmitTest
                        }
                    >

                        {/* TITLE */}

                        <div
                            style={{
                                marginBottom: "18px"
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
                                        e.target.value
                                    )
                                }
                                placeholder=
                                    "Enter test title"
                                required
                                style={{
                                    width: "100%",
                                    maxWidth: "700px",
                                    padding: "12px",
                                    marginTop: "7px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius:
                                        "8px"
                                }}
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div
                            style={{
                                marginBottom: "18px"
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
                                        e.target.value
                                    )
                                }
                                placeholder=
                                    "Enter test description"
                                rows="4"
                                required
                                style={{
                                    width: "100%",
                                    maxWidth: "700px",
                                    padding: "12px",
                                    marginTop: "7px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius:
                                        "8px"
                                }}
                            />

                        </div>


                        {/* DURATION */}

                        <div
                            style={{
                                marginBottom: "20px"
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
                                        e.target.value
                                    )
                                }
                                placeholder=
                                    "Minutes"
                                required
                                style={{
                                    width: "180px",
                                    padding: "12px",
                                    marginTop: "7px",
                                    border:
                                        "1px solid #d1d5db",
                                    borderRadius:
                                        "8px"
                                }}
                            />

                            <span
                                style={{
                                    marginLeft: "10px",
                                    color: "#6b7280"
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
                                padding:
                                    "12px 22px",
                                background:
                                    "#4f46e5",
                                color: "white",
                                borderRadius:
                                    "8px",
                                fontWeight:
                                    "600"
                            }}
                        >

                            {loading
                                ? "Saving..."
                                : editingTestId
                                    ? "Update Test"
                                    : "Create Test"
                            }

                        </button>


                        {editingTestId && (

                            <button
                                type="button"
                                onClick={() => {

                                    clearTestForm();

                                    setMessage("");

                                }}
                                style={{
                                    marginLeft:
                                        "10px",
                                    padding:
                                        "12px 22px",
                                    background:
                                        "#e5e7eb",
                                    borderRadius:
                                        "8px"
                                }}
                            >
                                Cancel Edit
                            </button>

                        )}

                    </form>


                    {message && (

                        <p
                            style={{
                                marginTop: "18px",
                                padding: "12px",
                                background:
                                    "#eef2ff",
                                color:
                                    "#3730a3",
                                borderRadius:
                                    "8px"
                            }}
                        >
                            {message}
                        </p>

                    )}

                </div>


                {/* ================================= */}
                {/* TESTS */}
                {/* ================================= */}

                <div>

                    <h2
                        style={{
                            marginBottom:
                                "20px"
                        }}
                    >
                        Manage Tests
                    </h2>


                    {tests.length === 0 && (

                        <div
                            style={{
                                background:
                                    "white",
                                padding:
                                    "30px",
                                borderRadius:
                                    "12px"
                            }}
                        >
                            No tests found.
                        </div>

                    )}


                    <div
                        style={{
                            display:
                                "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap:
                                "20px"
                        }}
                    >

                        {tests.map(
                            (test) => (

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
                                            "0 4px 15px rgba(0,0,0,0.06)"
                                    }}
                                >

                                    <h3
                                        style={{
                                            marginBottom:
                                                "10px"
                                        }}
                                    >
                                        {test.title}
                                    </h3>


                                    <p
                                        style={{
                                            color:
                                                "#6b7280",
                                            lineHeight:
                                                "1.5"
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
                                                "1px solid #e5e7eb"
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
                                                "20px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                background:
                                                    "#f8fafc",
                                                padding:
                                                    "12px",
                                                borderRadius:
                                                    "8px"
                                            }}
                                        >

                                            <small
                                                style={{
                                                    color:
                                                        "#6b7280"
                                                }}
                                            >
                                                Duration
                                            </small>

                                            <strong
                                                style={{
                                                    display:
                                                        "block",
                                                    marginTop:
                                                        "4px"
                                                }}
                                            >
                                                {test.duration} min
                                            </strong>

                                        </div>


                                        <div
                                            style={{
                                                background:
                                                    "#f8fafc",
                                                padding:
                                                    "12px",
                                                borderRadius:
                                                    "8px"
                                            }}
                                        >

                                            <small
                                                style={{
                                                    color:
                                                        "#6b7280"
                                                }}
                                            >
                                                Questions
                                            </small>

                                            <strong
                                                style={{
                                                    display:
                                                        "block",
                                                    marginTop:
                                                        "4px"
                                                }}
                                            >
                                                {test.questionCount}
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
                                                gridColumn:
                                                    "1 / -1"
                                            }}
                                        >

                                            <small
                                                style={{
                                                    color:
                                                        "#6b7280"
                                                }}
                                            >
                                                Total Marks
                                            </small>

                                            <strong
                                                style={{
                                                    display:
                                                        "block",
                                                    marginTop:
                                                        "4px"
                                                }}
                                            >
                                                {test.totalMarks}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* QUESTION BUTTON */}

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
                                                "11px",
                                            background:
                                                "#4f46e5",
                                            color:
                                                "white",
                                            borderRadius:
                                                "8px",
                                            fontWeight:
                                                "600",
                                            marginBottom:
                                                "10px"
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
                                            borderRadius:
                                                "8px"
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
                                            borderRadius:
                                                "8px"
                                        }}
                                    >
                                        Delete
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* ================================= */}
                {/* STUDENT RESULTS */}
                {/* ================================= */}

                <div
                    style={{
                        marginTop:
                            "45px"
                    }}
                >

                    <h2
                        style={{
                            marginBottom:
                                "20px"
                        }}
                    >
                        Student Results
                    </h2>


                    {loadingResults && (

                        <div
                            style={{
                                background:
                                    "white",
                                padding:
                                    "25px",
                                borderRadius:
                                    "12px"
                            }}
                        >
                            Loading results...
                        </div>

                    )}


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
                                        "8px"
                                }}
                            >
                                {resultMessage}
                            </div>

                        )}


                    {!loadingResults &&
                        !resultMessage &&
                        results.length === 0 && (

                            <div
                                style={{
                                    background:
                                        "white",
                                    padding:
                                        "25px",
                                    borderRadius:
                                        "12px"
                                }}
                            >
                                No student results yet.
                            </div>

                        )}


                    {!loadingResults &&
                        !resultMessage &&
                        results.length > 0 && (

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gap:
                                        "15px"
                                }}
                            >

                                {results.map(
                                    (result) => (

                                        <div
                                            key={
                                                result._id
                                            }
                                            style={{
                                                background:
                                                    "white",
                                                padding:
                                                    "20px",
                                                borderRadius:
                                                    "12px",
                                                boxShadow:
                                                    "0 3px 12px rgba(0,0,0,0.05)",
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                flexWrap:
                                                    "wrap",
                                                gap:
                                                    "15px"
                                            }}
                                        >

                                            <div>

                                                <h3>
                                                    {
                                                        result
                                                            .test
                                                            ?.title
                                                    }
                                                </h3>

                                                <p
                                                    style={{
                                                        color:
                                                            "#6b7280",
                                                        marginTop:
                                                            "6px"
                                                    }}
                                                >
                                                    Student:{" "}
                                                    {
                                                        result
                                                            .student
                                                            ?.name
                                                    }
                                                </p>

                                                <p
                                                    style={{
                                                        color:
                                                            "#6b7280",
                                                        marginTop:
                                                            "4px"
                                                    }}
                                                >
                                                    Email:{" "}
                                                    {
                                                        result
                                                            .student
                                                            ?.email
                                                    }
                                                </p>

                                                <p
                                                    style={{
                                                        color:
                                                            "#9ca3af",
                                                        marginTop:
                                                            "5px",
                                                        fontSize:
                                                            "14px"
                                                    }}
                                                >
                                                    Attempted on:{" "}
                                                    {formatDate(
                                                        result.createdAt
                                                    )}
                                                </p>

                                            </div>


                                            <div
                                                style={{
                                                    textAlign:
                                                        "center",
                                                    background:
                                                        "#eef2ff",
                                                    padding:
                                                        "15px 25px",
                                                    borderRadius:
                                                        "10px"
                                                }}
                                            >

                                                <small
                                                    style={{
                                                        color:
                                                            "#6b7280"
                                                    }}
                                                >
                                                    Score
                                                </small>

                                                <h2
                                                    style={{
                                                        color:
                                                            "#4f46e5",
                                                        marginTop:
                                                            "5px"
                                                    }}
                                                >
                                                    {
                                                        result.score
                                                    }
                                                    {" / "}
                                                    {
                                                        result.totalMarks
                                                    }
                                                </h2>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;