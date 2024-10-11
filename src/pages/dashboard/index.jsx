import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const QuizDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Set waktu 10 detik
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function GETDATA() {
      axios
        .get("https://opentdb.com/api.php?amount=10&type=boolean")
        .then(function (response) {
          setQuestions(response.data.results);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    if (questions.length === 0) {
      GETDATA();
    }
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
    }
  }, [questions]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setTimeLeft(10);
    } else {
      setShowResult(true);
    }
  };

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
        Loading...
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
        <h2 className="text-2xl font-bold mb-4">Quiz Finished!</h2>
        <p className="text-lg">
          Your score is: {score} out of {questions.length}
        </p>
        <div className="flex justify-around mb-6 mt-10 ">
          <button
            className="mr-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              navigate("/");
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl w-full">
        <div className="text-center text-gray-800 flex">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <p className="ml-auto text-xl font-semibold">
            Time left: {timeLeft}s
          </p>
        </div>
        <div className="text-lg text-gray-700 mb-6">
          <p>
            {questions[currentQuestionIndex].question
              .replace(/&#039;/g, "'")
              .replace(/&quot;/g, '"')}
          </p>
        </div>
        <div className="flex justify-around mb-6">
          <button
            onClick={() => handleAnswer("True")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            True
          </button>
          <button
            onClick={() => handleAnswer("False")}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            False
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDashboard;
