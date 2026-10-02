const API_URL = "http://localhost:5000/api";


// =====================================
// REGISTER USER
// =====================================

export const registerUser = async (userData) => {

    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    return response.json();
};


// =====================================
// LOGIN USER
// =====================================

export const loginUser = async (userData) => {

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    return response.json();
};


// =====================================
// GET ALL TESTS
// =====================================

export const getAllTests = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/tests`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
};


// =====================================
// GET MY RESULTS
// =====================================

export const getMyResults = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/results/my-results`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.json();
};