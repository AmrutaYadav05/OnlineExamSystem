import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);


        try {

            const data =
                await loginUser({
                    email,
                    password
                });


            if (data.token) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );


                if (
                    data.user.role ===
                    "student"
                ) {

                    navigate(
                        "/student-dashboard"
                    );

                } else if (
                    data.user.role ===
                    "admin"
                ) {

                    navigate(
                        "/admin-dashboard"
                    );

                } else {

                    setMessage(
                        "Unknown user role"
                    );

                }

            } else {

                setMessage(
                    data.message ||
                    "Login failed"
                );

            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setMessage(
                "Unable to connect to the server"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "450px",
                    background: "white",
                    padding: "35px",
                    borderRadius: "14px",
                    boxShadow:
                        "0 5px 20px rgba(0,0,0,0.08)"
                }}
            >

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >

                    <h1>
                        Online Examination System
                    </h1>

                    <p
                        style={{
                            color: "#6b7280"
                        }}
                    >
                        Login to continue
                    </p>

                </div>


                <form onSubmit={handleLogin}>

                    {/* EMAIL */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your email"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "7px",
                                boxSizing:
                                    "border-box"
                            }}
                        />

                    </div>


                    {/* PASSWORD */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label>
                            Password
                        </label>

                        <div
                            style={{
                                display: "flex",
                                marginTop: "7px"
                            }}
                        >

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter password"
                                required
                                style={{
                                    flex: 1,
                                    padding: "12px"
                                }}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                style={{
                                    marginLeft: "5px",
                                    padding:
                                        "0 12px"
                                }}
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>


                    {/* MESSAGE */}

                    {message && (

                        <div
                            style={{
                                background:
                                    "#fef2f2",
                                color:
                                    "#b91c1c",
                                padding:
                                    "10px",
                                borderRadius:
                                    "7px",
                                marginBottom:
                                    "15px"
                            }}
                        >
                            {message}
                        </div>

                    )}


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px",
                            background:
                                "#4f46e5",
                            color: "white",
                            borderRadius:
                                "8px",
                            fontSize: "15px",
                            fontWeight: "600"
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                {/* REGISTER */}

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >

                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/register"
                            )
                        }
                        style={{
                            background: "none",
                            color: "#4f46e5",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Register
                    </button>

                </p>

            </div>

        </div>

    );
}

export default Login;