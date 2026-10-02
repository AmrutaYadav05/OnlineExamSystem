import { Navigate } from "react-router-dom";

function ProtectedRoute({
    children,
    allowedRole
}) {

    const token =
        localStorage.getItem("token");

    const userData =
        localStorage.getItem("user");


    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!token || !userData) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // GET USER
    // ==========================================

    let user;

    try {

        user =
            JSON.parse(userData);

    } catch (error) {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // ROLE CHECK
    // ==========================================

    if (
        allowedRole &&
        user.role !== allowedRole
    ) {

        if (
            user.role === "student"
        ) {

            return (
                <Navigate
                    to="/student-dashboard"
                    replace
                />
            );

        }


        if (
            user.role === "admin"
        ) {

            return (
                <Navigate
                    to="/admin-dashboard"
                    replace
                />
            );

        }


        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // AUTHORIZED
    // ==========================================

    return children;
}

export default ProtectedRoute;