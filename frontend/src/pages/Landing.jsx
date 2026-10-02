import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
                color: "#111827"
            }}
        >
            {/* HERO SECTION */}
            <section
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "80px 30px 60px",
                    textAlign: "center"
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        background: "#eef2ff",
                        color: "#4338ca",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "20px"
                    }}
                >
                    ONLINE EXAMINATION SYSTEM
                </div>

                <h1
                    style={{
                        fontSize: "48px",
                        lineHeight: "1.15",
                        margin: "0 auto 20px",
                        maxWidth: "750px",
                        color: "#111827"
                    }}
                >
                    Test Your Knowledge.
                    <br />
                    <span style={{ color: "#4f46e5" }}>
                        Get Your Results Instantly.
                    </span>
                </h1>

                <p
                    style={{
                        maxWidth: "650px",
                        margin: "0 auto",
                        color: "#6b7280",
                        fontSize: "18px",
                        lineHeight: "1.7"
                    }}
                >
                    A simple and secure online examination platform
                    where students can attempt tests and receive
                    instant results, while administrators can create
                    and manage examinations.
                </p>

                {/* BUTTONS */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                        marginTop: "35px",
                        flexWrap: "wrap"
                    }}
                >
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            padding: "13px 30px",
                            background: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "600"
                        }}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            padding: "13px 30px",
                            background: "white",
                            color: "#4f46e5",
                            border: "1px solid #4f46e5",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "600"
                        }}
                    >
                        Register
                    </button>
                </div>
            </section>

            {/* FEATURES */}
            <section
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "20px 30px 70px"
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: "30px",
                        marginBottom: "35px"
                    }}
                >
                    Platform Features
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px"
                    }}
                >
                    {/* FEATURE 1 */}
                    <div
                        style={{
                            background: "white",
                            padding: "28px",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            textAlign: "center",
                            boxShadow:
                                "0 3px 12px rgba(0,0,0,0.05)"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "32px",
                                marginBottom: "15px"
                            }}
                        >
                            📝
                        </div>

                        <h3>Online Tests</h3>

                        <p
                            style={{
                                color: "#6b7280",
                                lineHeight: "1.6"
                            }}
                        >
                            Attempt examinations online
                            from a simple and convenient
                            interface.
                        </p>
                    </div>

                    {/* FEATURE 2 */}
                    <div
                        style={{
                            background: "white",
                            padding: "28px",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            textAlign: "center",
                            boxShadow:
                                "0 3px 12px rgba(0,0,0,0.05)"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "32px",
                                marginBottom: "15px"
                            }}
                        >
                            ⏱️
                        </div>

                        <h3>Timed Exams</h3>

                        <p
                            style={{
                                color: "#6b7280",
                                lineHeight: "1.6"
                            }}
                        >
                            Complete your examination
                            within the given time limit.
                        </p>
                    </div>

                    {/* FEATURE 3 */}
                    <div
                        style={{
                            background: "white",
                            padding: "28px",
                            borderRadius: "12px",
                            textAlign: "center",
                            border: "1px solid #e5e7eb",
                            boxShadow:
                                "0 3px 12px rgba(0,0,0,0.05)"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "32px",
                                marginBottom: "15px"
                            }}
                        >
                            📊
                        </div>

                        <h3>Instant Results</h3>

                        <p
                            style={{
                                color: "#6b7280",
                                lineHeight: "1.6"
                            }}
                        >
                            Get your score immediately
                            after submitting the examination.
                        </p>
                    </div>

                    {/* FEATURE 4 */}
                    <div
                        style={{
                            background: "white",
                            padding: "28px",
                            borderRadius: "12px",
                            textAlign: "center",
                            border: "1px solid #e5e7eb",
                            boxShadow:
                                "0 3px 12px rgba(0,0,0,0.05)"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "32px",
                                marginBottom: "15px"
                            }}
                        >
                            🔐
                        </div>

                        <h3>Secure Access</h3>

                        <p
                            style={{
                                color: "#6b7280",
                                lineHeight: "1.6"
                            }}
                        >
                            Authentication and role-based
                            access keep the examination
                            system secure.
                        </p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section
                style={{
                    background: "white",
                    borderTop: "1px solid #e5e7eb",
                    borderBottom: "1px solid #e5e7eb",
                    padding: "60px 30px"
                }}
            >
                <div
                    style={{
                        maxWidth: "900px",
                        margin: "0 auto"
                    }}
                >
                    <h2
                        style={{
                            textAlign: "center",
                            fontSize: "30px",
                            marginBottom: "40px"
                        }}
                    >
                        How It Works
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "25px",
                            textAlign: "center"
                        }}
                    >
                        <div>
                            <h3>01. Login</h3>
                            <p
                                style={{
                                    color: "#6b7280"
                                }}
                            >
                                Login using your account.
                            </p>
                        </div>

                        <div>
                            <h3>02. Take Test</h3>
                            <p
                                style={{
                                    color: "#6b7280"
                                }}
                            >
                                Select and attempt an available
                                examination.
                            </p>
                        </div>

                        <div>
                            <h3>03. Submit</h3>
                            <p
                                style={{
                                    color: "#6b7280"
                                }}
                            >
                                Submit your answers before
                                the timer ends.
                            </p>
                        </div>

                        <div>
                            <h3>04. View Result</h3>
                            <p
                                style={{
                                    color: "#6b7280"
                                }}
                            >
                                See your score immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer
                style={{
                    textAlign: "center",
                    padding: "25px",
                    color: "#6b7280",
                    fontSize: "14px"
                }}
            >
                <p style={{ margin: 0 }}>
                    © 2026 Online Examination System
                </p>
            </footer>
        </div>
    );
}

export default Landing;