import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import AttemptTest from "./pages/AttemptTest";
import Result from "./pages/Result";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AddQuestion from "./pages/AddQuestion";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>

            {/* Navbar is automatically hidden
                when the user is not logged in */}
            <Navbar />

            <Routes>

                {/* ============================= */}
                {/* PUBLIC ROUTES */}
                {/* ============================= */}

                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ============================= */}
                {/* STUDENT ROUTES */}
                {/* ============================= */}

                <Route
                    path="/student-dashboard"
                    element={
                        <ProtectedRoute
                            allowedRole="student"
                        >
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/attempt-test/:testId"
                    element={
                        <ProtectedRoute
                            allowedRole="student"
                        >
                            <AttemptTest />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/result"
                    element={
                        <ProtectedRoute
                            allowedRole="student"
                        >
                            <Result />
                        </ProtectedRoute>
                    }
                />


                {/* ============================= */}
                {/* ADMIN ROUTES */}
                {/* ============================= */}

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute
                            allowedRole="admin"
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add-question/:testId"
                    element={
                        <ProtectedRoute
                            allowedRole="admin"
                        >
                            <AddQuestion />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;