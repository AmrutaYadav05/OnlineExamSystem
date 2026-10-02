import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function AddQuestion() {

    const { testId } = useParams();

    const navigate = useNavigate();


    // ==========================================
    // TEST DATA
    // ==========================================

    const [test, setTest] = useState(null);

    const [questions, setQuestions] =
        useState([]);


    // ==========================================
    // FORM DATA
    // ==========================================

    const [questionText, setQuestionText] =
        useState("");

    const [option1, setOption1] =
        useState("");

    const [option2, setOption2] =
        useState("");

    const [option3, setOption3] =
        useState("");

    const [option4, setOption4] =
        useState("");

    const [correctAnswer, setCorrectAnswer] =
        useState("");

    const [marks, setMarks] =
        useState(1);


    // ==========================================
    // EDIT / UI STATES
    // ==========================================

    const [editingId, setEditingId] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [loadingQuestions, setLoadingQuestions] =
        useState(true);


    // ==========================================
    // LOAD TEST
    // ==========================================

    const loadTest = async () => {

        try {

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_URL}/tests/${testId}`,
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

                setTest(data.test);

            } else {

                setMessage(
                    data.message ||
                    "Unable to load test"
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
    // LOAD QUESTIONS
    // ==========================================

    const loadQuestions = async () => {

        try {

            setLoadingQuestions(true);


            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_URL}/questions/test/${testId}`,
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

                setQuestions(
                    data.questions || []
                );

            } else {

                setMessage(
                    data.message ||
                    "Unable to load questions"
                );

            }

        } catch (error) {

            console.error(
                "Error loading questions:",
                error
            );

            setMessage(
                "Unable to connect to server"
            );

        } finally {

            setLoadingQuestions(false);

        }

    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadTest();

        loadQuestions();

    }, [testId]);


    // ==========================================
    // SUBMIT QUESTION
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setMessage("");

        setLoading(true);


        const options = [
            option1,
            option2,
            option3,
            option4
        ];


        try {

            const token =
                localStorage.getItem("token");


            let url;

            let method;


            if (editingId) {

                url =
                    `${API_URL}/questions/${editingId}`;

                method = "PUT";

            } else {

                url =
                    `${API_URL}/questions`;

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
                                test: testId,

                                questionText,

                                options,

                                correctAnswer,

                                marks:
                                    Number(marks)
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


            if (editingId) {

                setMessage(
                    "Question updated successfully!"
                );

            } else {

                setMessage(
                    "Question added successfully!"
                );

            }


            clearForm();


            await loadQuestions();

            await loadTest();


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
    // CLEAR FORM
    // ==========================================

    const clearForm = () => {

        setQuestionText("");

        setOption1("");

        setOption2("");

        setOption3("");

        setOption4("");

        setCorrectAnswer("");

        setMarks(1);

        setEditingId(null);

    };


    // ==========================================
    // EDIT QUESTION
    // ==========================================

    const handleEdit = (question) => {

        setEditingId(
            question._id
        );


        setQuestionText(
            question.questionText
        );


        setOption1(
            question.options[0] || ""
        );


        setOption2(
            question.options[1] || ""
        );


        setOption3(
            question.options[2] || ""
        );


        setOption4(
            question.options[3] || ""
        );


        setCorrectAnswer(
            question.correctAnswer
        );


        setMarks(
            question.marks
        );


        setMessage(
            "Editing question..."
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // DELETE QUESTION
    // ==========================================

    const handleDelete = async (questionId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this question?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_URL}/questions/${questionId}`,
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
                    "Failed to delete question"
                );

                return;

            }


            setMessage(
                "Question deleted successfully!"
            );


            await loadQuestions();

            await loadTest();


        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to connect to server"
            );

        }

    };


    // ==========================================
    // TOTAL MARKS
    // ==========================================

    const calculateTotalMarks = () => {

        return questions.reduce(
            (total, question) =>
                total + Number(question.marks || 0),
            0
        );

    };


    // ==========================================
    // RETURN UI
    // ==========================================

    return (

        <div
            style={{
                maxWidth: "1000px",
                margin: "0 auto",
                padding: "30px"
            }}
        >

            {/* ================================= */}
            {/* PAGE HEADER */}
            {/* ================================= */}

            <h1>
                Question Management
            </h1>


            {test && (

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding:
                            "20px",
                        marginBottom:
                            "25px",
                        borderRadius:
                            "8px"
                    }}
                >

                    <h2>
                        {test.title}
                    </h2>

                    <p>
                        {test.description}
                    </p>

                    <p>
                        Duration:{" "}
                        <strong>
                            {test.duration}
                        </strong>{" "}
                        minutes
                    </p>

                </div>

            )}


            {/* ================================= */}
            {/* SUMMARY */}
            {/* ================================= */}

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "25px",
                    flexWrap: "wrap"
                }}
            >

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding:
                            "20px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "200px"
                    }}
                >

                    <h3>
                        Total Questions
                    </h3>

                    <h2>
                        {questions.length}
                    </h2>

                </div>


                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding:
                            "20px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "200px"
                    }}
                >

                    <h3>
                        Total Marks
                    </h3>

                    <h2>
                        {calculateTotalMarks()}
                    </h2>

                </div>

            </div>


            <hr />


            {/* ================================= */}
            {/* ADD / EDIT FORM */}
            {/* ================================= */}

            <h2>
                {editingId
                    ? "Edit Question"
                    : "Add New Question"
                }
            </h2>


            <form
                onSubmit={handleSubmit}
            >

                {/* QUESTION */}

                <div>

                    <label>
                        <strong>
                            Question
                        </strong>
                    </label>

                    <br />

                    <textarea
                        value={
                            questionText
                        }
                        onChange={(e) =>
                            setQuestionText(
                                e.target.value
                            )
                        }
                        placeholder=
                            "Enter question"
                        rows="4"
                        style={{
                            width:
                                "100%",
                            maxWidth:
                                "700px"
                        }}
                        required
                    />

                </div>


                <br />


                {/* OPTION 1 */}

                <div>

                    <label>
                        Option 1
                    </label>

                    <br />

                    <input
                        type="text"
                        value={option1}
                        onChange={(e) =>
                            setOption1(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>


                <br />


                {/* OPTION 2 */}

                <div>

                    <label>
                        Option 2
                    </label>

                    <br />

                    <input
                        type="text"
                        value={option2}
                        onChange={(e) =>
                            setOption2(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>


                <br />


                {/* OPTION 3 */}

                <div>

                    <label>
                        Option 3
                    </label>

                    <br />

                    <input
                        type="text"
                        value={option3}
                        onChange={(e) =>
                            setOption3(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>


                <br />


                {/* OPTION 4 */}

                <div>

                    <label>
                        Option 4
                    </label>

                    <br />

                    <input
                        type="text"
                        value={option4}
                        onChange={(e) =>
                            setOption4(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>


                <br />


                {/* CORRECT ANSWER */}

                <div>

                    <label>
                        <strong>
                            Correct Answer
                        </strong>
                    </label>

                    <br />

                    <select
                        value={
                            correctAnswer
                        }
                        onChange={(e) =>
                            setCorrectAnswer(
                                e.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Select correct answer
                        </option>

                        <option value={option1}>
                            {option1 ||
                                "Option 1"}
                        </option>

                        <option value={option2}>
                            {option2 ||
                                "Option 2"}
                        </option>

                        <option value={option3}>
                            {option3 ||
                                "Option 3"}
                        </option>

                        <option value={option4}>
                            {option4 ||
                                "Option 4"}
                        </option>

                    </select>

                </div>


                <br />


                {/* MARKS */}

                <div>

                    <label>
                        <strong>
                            Marks
                        </strong>
                    </label>

                    <br />

                    <input
                        type="number"
                        min="1"
                        value={marks}
                        onChange={(e) =>
                            setMarks(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>


                <br />


                {/* BUTTONS */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Saving..."
                        : editingId
                            ? "Update Question"
                            : "Add Question"
                    }

                </button>


                {editingId && (

                    <button
                        type="button"
                        onClick={() => {

                            clearForm();

                            setMessage("");

                        }}
                        style={{
                            marginLeft:
                                "10px"
                        }}
                    >
                        Cancel Edit
                    </button>

                )}

            </form>


            {/* MESSAGE */}

            {message && (

                <p>
                    {message}
                </p>

            )}


            <hr />


            {/* ================================= */}
            {/* QUESTION LIST */}
            {/* ================================= */}

            <h2>
                All Questions
            </h2>


            {loadingQuestions && (

                <p>
                    Loading questions...
                </p>

            )}


            {!loadingQuestions &&
                questions.length === 0 && (

                    <p>
                        No questions added yet.
                    </p>

                )}


            {!loadingQuestions &&
                questions.length > 0 && (

                    <div>

                        {questions.map(
                            (question, index) => (

                                <div
                                    key={
                                        question._id
                                    }
                                    style={{
                                        border:
                                            "1px solid #ccc",
                                        padding:
                                            "20px",
                                        marginBottom:
                                            "20px",
                                        borderRadius:
                                            "8px"
                                    }}
                                >

                                    {/* QUESTION NUMBER */}

                                    <h3>

                                        Question{" "}
                                        {index + 1}

                                    </h3>


                                    {/* QUESTION TEXT */}

                                    <p>

                                        <strong>
                                            Question:
                                        </strong>{" "}

                                        {
                                            question.questionText
                                        }

                                    </p>


                                    {/* OPTIONS */}

                                    <div>

                                        <strong>
                                            Options:
                                        </strong>


                                        {question.options.map(
                                            (
                                                option,
                                                optionIndex
                                            ) => (

                                                <p
                                                    key={
                                                        optionIndex
                                                    }
                                                    style={{
                                                        marginLeft:
                                                            "20px"
                                                    }}
                                                >

                                                    {String.fromCharCode(
                                                        65 +
                                                        optionIndex
                                                    )}
                                                    .{" "}
                                                    {option}

                                                </p>

                                            )
                                        )}

                                    </div>


                                    {/* CORRECT ANSWER */}

                                    <p>

                                        <strong>
                                            Correct Answer:
                                        </strong>{" "}

                                        {
                                            question.correctAnswer
                                        }

                                    </p>


                                    {/* MARKS */}

                                    <p>

                                        <strong>
                                            Marks:
                                        </strong>{" "}

                                        {
                                            question.marks
                                        }

                                    </p>


                                    {/* ACTION BUTTONS */}

                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                question
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                question._id
                                            )
                                        }
                                        style={{
                                            marginLeft:
                                                "10px"
                                        }}
                                    >
                                        Delete
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}


            <hr />


            {/* ================================= */}
            {/* BACK BUTTON */}
            {/* ================================= */}

            <button
                onClick={() =>
                    navigate(
                        "/admin-dashboard"
                    )
                }
            >
                Back to Admin Dashboard
            </button>

        </div>

    );

}


export default AddQuestion;