import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    let user = null;

    if (userData) {
        try {
            user = JSON.parse(userData);
        } catch (error) {
            console.error("Invalid user data");
        }
    }


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("latestResult");

        navigate("/login");

    };


    // Don't show navbar if user is not logged in
    if (!token || !user) {
        return null;
    }


    return (

        <nav
            style={{
                background: "#312e81",
                borderBottom: "1px solid #4338ca",
                padding: "15px 30px",

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                gap: "20px",
                flexWrap: "wrap",

                position: "sticky",
                top: 0,
                zIndex: 1000,

                boxShadow:
                    "0 2px 10px rgba(0,0,0,0.15)"
            }}
        >

            {/* WEBSITE NAME */}

            <div>

                <h2
                    style={{
                        margin: 0,
                        cursor: "pointer",
                        color: "white",
                        fontSize: "25px"
                    }}

                    onClick={() => {

                        if (user.role === "admin") {

                            navigate(
                                "/admin-dashboard"
                            );

                        } else {

                            navigate(
                                "/student-dashboard"
                            );

                        }

                    }}
                >
                    Online Exam
                </h2>

            </div>


            {/* RIGHT SIDE */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap"
                }}
            >


                {/* STUDENT BUTTONS */}

                {user.role === "student" && (

                    <>

                        {/* DASHBOARD */}

                        <button
                            onClick={() =>
                                navigate(
                                    "/student-dashboard"
                                )
                            }

                            style={{
                                padding: "9px 16px",
                                background: "#4338ca",
                                color: "white",
                                border: "none",
                                borderRadius: "7px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}
                        >
                            Dashboard
                        </button>


                        {/* MY RESULTS */}

                        <button
                            onClick={() =>
                                navigate("/result")
                            }

                            style={{
                                padding: "9px 16px",
                                background: "#4338ca",
                                color: "white",
                                border: "none",
                                borderRadius: "7px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}
                        >
                            My Results
                        </button>

                    </>

                )}


                {/* ADMIN BUTTON */}

                {user.role === "admin" && (

                    <button
                        onClick={() =>
                            navigate(
                                "/admin-dashboard"
                            )
                        }

                        style={{
                            padding: "9px 16px",
                            background: "#4338ca",
                            color: "white",
                            border: "none",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}
                    >
                        Dashboard
                    </button>

                )}


                {/* USER NAME */}

                <span
                    style={{
                        padding: "9px 12px",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}
                >
                    {user.name}
                </span>


                {/* LOGOUT */}

                <button
                    onClick={handleLogout}

                    style={{
                        padding: "9px 17px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "7px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >
                    Logout
                </button>

            </div>

        </nav>

    );
}

export default Navbar;