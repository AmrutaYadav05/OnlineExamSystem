import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {

    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchResults = async () => {

            try {

                const token =
                    localStorage.getItem("token");


                if (!token) {

                    navigate("/login");
                    return;

                }


                const response = await fetch(
                    "http://localhost:5000/api/results/my-results",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                const data =
                    await response.json();


                // IMPORTANT:
                // Check what backend is sending

                console.log(
                    "RESULT API RESPONSE:",
                    data
                );


                if (!response.ok) {

                    setError(
                        data.message ||
                        "Failed to load results"
                    );

                    return;
                }


                // Backend response:
                // {
                //    count: 1,
                //    results: [...]
                // }

                setResults(
                    Array.isArray(data.results)
                        ? data.results
                        : []
                );


            } catch (error) {

                console.error(
                    "Result fetch error:",
                    error
                );

                setError(
                    "Unable to connect to server"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchResults();

    }, [navigate]);


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div
                style={{
                    minHeight: "80vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px"
                }}
            >
                Loading results...
            </div>

        );

    }


    /* =========================
       MAIN PAGE
    ========================= */

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f9",
                padding: "40px 25px"
            }}
        >

            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}
            >

                {/* HEADER */}

                <h1
                    style={{
                        margin: "0 0 8px",
                        color: "#111827"
                    }}
                >
                    My Results
                </h1>


                <p
                    style={{
                        color: "#6b7280",
                        marginBottom: "30px"
                    }}
                >
                    View your examination results and scores.
                </p>


                {/* ERROR */}

                {error && (

                    <div
                        style={{
                            background: "#fef2f2",
                            color: "#b91c1c",
                            padding: "15px",
                            borderRadius: "8px",
                            marginBottom: "20px"
                        }}
                    >
                        {error}
                    </div>

                )}


                {/* NO RESULTS */}

                {!error &&
                    results.length === 0 && (

                    <div
                        style={{
                            background: "white",
                            padding: "50px",
                            borderRadius: "14px",
                            textAlign: "center",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.06)"
                        }}
                    >

                        <h2>
                            No Results Yet
                        </h2>

                        <p
                            style={{
                                color: "#6b7280"
                            }}
                        >
                            You have not attempted
                            any test yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/student-dashboard"
                                )
                            }

                            style={{
                                marginTop: "15px",
                                padding: "11px 20px",
                                background: "#4f46e5",
                                color: "white",
                                border: "none",
                                borderRadius: "7px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            View Available Tests
                        </button>

                    </div>

                )}


                {/* RESULTS */}

                {results.length > 0 && (

                    <div
                        style={{
                            display: "grid",
                            gap: "20px"
                        }}
                    >

                        {results.map(
                            (result, index) => {

                                const score =
                                    result.score || 0;

                                const totalMarks =
                                    result.totalMarks || 0;

                                const percentage =
                                    totalMarks > 0
                                        ? (
                                            score /
                                            totalMarks
                                        ) * 100
                                        : 0;


                                return (

                                    <div
                                        key={
                                            result._id ||
                                            index
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

                                        {/* TEST NAME */}

                                        <div
                                            style={{
                                                display:
                                                    "flex",

                                                justifyContent:
                                                    "space-between",

                                                alignItems:
                                                    "center",

                                                gap: "20px",

                                                flexWrap:
                                                    "wrap"
                                            }}
                                        >

                                            <div>

                                                <h2
                                                    style={{
                                                        margin:
                                                            "0 0 8px",

                                                        color:
                                                            "#111827"
                                                    }}
                                                >
                                                    {
                                                        result.test?.title ||
                                                        "Examination"
                                                    }
                                                </h2>


                                                <p
                                                    style={{
                                                        margin: 0,
                                                        color:
                                                            "#6b7280"
                                                    }}
                                                >
                                                    Attempted on{" "}

                                                    {result.createdAt
                                                        ? new Date(
                                                            result.createdAt
                                                        ).toLocaleString()
                                                        : "N/A"}
                                                </p>

                                            </div>


                                            {/* SCORE */}

                                            <div
                                                style={{
                                                    background:
                                                        "#eef2ff",

                                                    padding:
                                                        "15px 25px",

                                                    borderRadius:
                                                        "10px",

                                                    textAlign:
                                                        "center"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "28px",

                                                        fontWeight:
                                                            "700",

                                                        color:
                                                            "#4338ca"
                                                    }}
                                                >
                                                    {score} / {totalMarks}
                                                </div>


                                                <div
                                                    style={{
                                                        color:
                                                            "#6b7280",

                                                        fontSize:
                                                            "14px"
                                                    }}
                                                >
                                                    Score
                                                </div>

                                            </div>

                                        </div>


                                        {/* INFORMATION */}

                                        <div
                                            style={{
                                                display:
                                                    "grid",

                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(180px, 1fr))",

                                                gap: "15px",

                                                marginTop:
                                                    "25px"
                                            }}
                                        >

                                            {/* PERCENTAGE */}

                                            <div
                                                style={{
                                                    background:
                                                        "#f9fafb",

                                                    padding:
                                                        "16px",

                                                    borderRadius:
                                                        "8px"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        color:
                                                            "#6b7280",

                                                        fontSize:
                                                            "13px",

                                                        marginBottom:
                                                            "5px"
                                                    }}
                                                >
                                                    Percentage
                                                </div>


                                                <strong
                                                    style={{
                                                        fontSize:
                                                            "21px"
                                                    }}
                                                >
                                                    {percentage.toFixed(
                                                        1
                                                    )}
                                                    %
                                                </strong>

                                            </div>


                                            {/* TOTAL MARKS */}

                                            <div
                                                style={{
                                                    background:
                                                        "#f9fafb",

                                                    padding:
                                                        "16px",

                                                    borderRadius:
                                                        "8px"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        color:
                                                            "#6b7280",

                                                        fontSize:
                                                            "13px",

                                                        marginBottom:
                                                            "5px"
                                                    }}
                                                >
                                                    Total Marks
                                                </div>


                                                <strong
                                                    style={{
                                                        fontSize:
                                                            "21px"
                                                    }}
                                                >
                                                    {totalMarks}
                                                </strong>

                                            </div>


                                            {/* QUESTIONS */}

                                            <div
                                                style={{
                                                    background:
                                                        "#f9fafb",

                                                    padding:
                                                        "16px",

                                                    borderRadius:
                                                        "8px"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        color:
                                                            "#6b7280",

                                                        fontSize:
                                                            "13px",

                                                        marginBottom:
                                                            "5px"
                                                    }}
                                                >
                                                    Questions Attempted
                                                </div>


                                                <strong
                                                    style={{
                                                        fontSize:
                                                            "21px"
                                                    }}
                                                >
                                                    {
                                                        result.answers
                                                            ?.length ||
                                                        0
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <div
                                            style={{
                                                marginTop:
                                                    "20px"
                                            }}
                                        >

                                            <span
                                                style={{
                                                    display:
                                                        "inline-block",

                                                    padding:
                                                        "7px 14px",

                                                    borderRadius:
                                                        "20px",

                                                    background:
                                                        percentage >= 50
                                                            ? "#dcfce7"
                                                            : "#fee2e2",

                                                    color:
                                                        percentage >= 50
                                                            ? "#166534"
                                                            : "#991b1b",

                                                    fontWeight:
                                                        "600",

                                                    fontSize:
                                                        "14px"
                                                }}
                                            >
                                                {percentage >= 50
                                                    ? "Passed"
                                                    : "Needs Improvement"}
                                            </span>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}

export default Result;