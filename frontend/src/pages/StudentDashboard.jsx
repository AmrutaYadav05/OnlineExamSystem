import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";


function StudentDashboard() {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const navigate = useNavigate();


    const [tests, setTests] =
        useState([]);

    const [results, setResults] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
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

            console.error(error);

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

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_URL}/results/my-results`,
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

                setResults(
                    data.results || []
                );

            }

        } catch (error) {

            console.error(
                "Error loading results:",
                error
            );

        }

    };


    // ==========================================
    // LOAD EVERYTHING
    // ==========================================

    useEffect(() => {

        const loadData =
            async () => {

                setLoading(true);

                await Promise.all([
                    loadTests(),
                    loadResults()
                ]);

                setLoading(false);

            };


        loadData();

    }, []);


    // ==========================================
    // CHECK IF TEST ATTEMPTED
    // ==========================================

    const hasAttempted = (testId) => {

        return results.some(
            result =>
                result.test?._id ===
                testId
        );

    };


    // ==========================================
    // GET RESULT
    // ==========================================

    const getResult = (testId) => {

        return results.find(
            result =>
                result.test?._id ===
                testId
        );

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
          background: "#f4f6f9",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "35px 25px",
          }}
        >
          {/* ================================= */}
          {/* WELCOME SECTION */}
          {/* ================================= */}

          <div
            style={{
              background: "white",
              padding: "28px 30px",
              borderRadius: "14px",
              marginBottom: "35px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                color: "#111827",
              }}
            >
              Welcome, {user?.name} 👋
            </h1>

            <p
              style={{
                margin: "0 0 6px",
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              Email: {user?.email}
            </p>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              Role: Student
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginTop: "22px",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  padding: "11px 17px",
                  borderRadius: "9px",
                  color: "#374151",
                }}
              >
                <strong>{tests.length}</strong> Available Tests
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  padding: "11px 17px",
                  borderRadius: "9px",
                  color: "#374151",
                }}
              >
                <strong>{results.length}</strong> Tests Attempted
              </div>
            </div>
          </div>

          {/* ================================= */}
          {/* AVAILABLE TESTS */}
          {/* ================================= */}

          <div>
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Available Tests
            </h2>

            {loading && (
              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                }}
              >
                Loading tests...
              </div>
            )}

            {message && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                {message}
              </div>
            )}

            {!loading && tests.length === 0 && (
              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <h3>No tests available</h3>

                <p
                  style={{
                    color: "#6b7280",
                    marginTop: "8px",
                  }}
                >
                  Please check again later.
                </p>
              </div>
            )}

            {/* TEST CARDS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {tests.map((test) => {
                const attempted = hasAttempted(test._id);

                const result = getResult(test._id);

                return (
                  <div
                    key={test._id}
                    style={{
                      background: "white",
                      padding: "25px",
                      borderRadius: "14px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* TITLE */}

                    <h3
                      style={{
                        color: "#111827",
                        marginBottom: "10px",
                      }}
                    >
                      {test.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                      style={{
                        color: "#6b7280",
                        lineHeight: "1.5",
                        minHeight: "45px",
                      }}
                    >
                      {test.description}
                    </p>

                    <hr
                      style={{
                        margin: "20px 0",
                        border: "none",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    />

                    {/* TEST INFO */}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          background: "#f8fafc",
                          padding: "12px",
                          borderRadius: "8px",
                        }}
                      >
                        <small
                          style={{
                            color: "#6b7280",
                          }}
                        >
                          Duration
                        </small>

                        <strong
                          style={{
                            display: "block",
                            marginTop: "4px",
                          }}
                        >
                          {test.duration} min
                        </strong>
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          padding: "12px",
                          borderRadius: "8px",
                        }}
                      >
                        <small
                          style={{
                            color: "#6b7280",
                          }}
                        >
                          Questions
                        </small>

                        <strong
                          style={{
                            display: "block",
                            marginTop: "4px",
                          }}
                        >
                          {test.questionCount}
                        </strong>
                      </div>

                      <div
                        style={{
                          background: "#f8fafc",
                          padding: "12px",
                          borderRadius: "8px",
                          gridColumn: "1 / -1",
                        }}
                      >
                        <small
                          style={{
                            color: "#6b7280",
                          }}
                        >
                          Total Marks
                        </small>

                        <strong
                          style={{
                            display: "block",
                            marginTop: "4px",
                          }}
                        >
                          {test.totalMarks}
                        </strong>
                      </div>
                    </div>

                    {/* ================================= */}
                    {/* NOT ATTEMPTED */}
                    {/* ================================= */}

                    {!attempted &&
                      (test.questionCount > 0 ? (
                        <button
                          onClick={() => navigate(`/attempt-test/${test._id}`)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            background: "#4f46e5",
                            color: "white",
                            borderRadius: "8px",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          Start Test
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            width: "100%",
                            padding: "12px",
                            background: "#d1d5db",
                            color: "#6b7280",
                            borderRadius: "8px",
                          }}
                        >
                          No Questions Available
                        </button>
                      ))}

                    {/* ================================= */}
                    {/* ALREADY ATTEMPTED */}
                    {/* ================================= */}

                    {attempted && (
                      <div
                        style={{
                          background: "#ecfdf5",
                          padding: "15px",
                          borderRadius: "8px",
                          border: "1px solid #a7f3d0",
                        }}
                      >
                        <p
                          style={{
                            color: "#047857",
                            fontWeight: "600",
                            marginBottom: "6px",
                          }}
                        >
                          ✓ Test Attempted
                        </p>

                        <p
                          style={{
                            color: "#374151",
                          }}
                        >
                          Your Score: <strong>{result?.score}</strong>
                          {" / "}
                          {result?.totalMarks}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================================= */}
          {/* MY RESULTS */}
          {/* ================================= */}

          <div
            style={{
              marginTop: "45px",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              My Results
            </h2>

            {results.length === 0 && !loading && (
              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                }}
              >
                No results yet.
              </div>
            )}

            {results.length > 0 && (
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                {results.map((result) => (
                  <div
                    key={result._id}
                    style={{
                      padding: "20px",
                      borderBottom: "1px solid #e5e7eb",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <h3>{result.test?.title}</h3>

                      <p
                        style={{
                          color: "#6b7280",
                          marginTop: "5px",
                        }}
                      >
                        Attempted on: {formatDate(result.createdAt)}
                      </p>
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <p
                        style={{
                          color: "#6b7280",
                        }}
                      >
                        Score
                      </p>

                      <h2
                        style={{
                          color: "#4f46e5",
                        }}
                      >
                        {result.score}
                        {" / "}
                        {result.totalMarks}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );

}


export default StudentDashboard;