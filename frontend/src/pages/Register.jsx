import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");


        if (password !== confirmPassword) {
            setError(
                "Passwords do not match"
            );
            return;
        }


        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters"
            );
            return;
        }


        setLoading(true);


        try {
            const data =
                await registerUser({
                    name,
                    email,
                    password,
                    role: "student"
                });


            if (data.user) {
                setMessage(
                    "Registration successful! Redirecting to login..."
                );


                setTimeout(() => {
                    navigate("/login");
                }, 1200);

            } else {
                setError(
                    data.message ||
                    "Registration failed"
                );
            }

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setError(
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
                        marginBottom: "25px"
                    }}
                >
                    <h1>
                        Create Account
                    </h1>

                    <p
                        style={{
                            color: "#6b7280"
                        }}
                    >
                        Register as a student
                    </p>
                </div>


                <form onSubmit={handleRegister}>

                    {/* NAME */}

                    <div
                        style={{
                            marginBottom: "18px"
                        }}
                    >
                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your name"
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


                    {/* EMAIL */}

                    <div
                        style={{
                            marginBottom: "18px"
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
                            marginBottom: "18px"
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


                    {/* CONFIRM PASSWORD */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >
                        <label>
                            Confirm Password
                        </label>

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={
                                confirmPassword
                            }
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Confirm password"
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


                    {/* ERROR */}

                    {error && (
                        <div
                            style={{
                                background:
                                    "#fef2f2",
                                color:
                                    "#b91c1c",
                                padding: "10px",
                                borderRadius:
                                    "7px",
                                marginBottom:
                                    "15px"
                            }}
                        >
                            {error}
                        </div>
                    )}


                    {/* SUCCESS */}

                    {message && (
                        <div
                            style={{
                                background:
                                    "#ecfdf5",
                                color:
                                    "#047857",
                                padding: "10px",
                                borderRadius:
                                    "7px",
                                marginBottom:
                                    "15px"
                            }}
                        >
                            {message}
                        </div>
                    )}


                    {/* REGISTER BUTTON */}

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
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                {/* LOGIN LINK */}

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >
                    Already have an account?{" "}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        style={{
                            background: "none",
                            color: "#4f46e5",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Login
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Register;