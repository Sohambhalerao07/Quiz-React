import { useReducer, useEffect } from "react";

import Header from "./Header.jsx";
import Main from "./Main.jsx";
import Loader from "./Loader.jsx";
import Error from "./Error.jsx";
import StartScreen from "./StartScreen.jsx";
import Question from "./Question.jsx";
import NextButton from "./NextButton.jsx";
import Progress from "./Progress.jsx";
import FinishScreen from "./FinishScreen.jsx";
import Footer from "./Footer.jsx";
import Timer from "./Timer.jsx";
import "../index.css";

const SECS_PER_QUESTION = 5;

// Hardcoded questions
const hardcodedQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    correctOption: "Paris",
    points: 1,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctOption: "Mars",
    points: 1,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctOption: "Pacific Ocean",
    points: 1,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Leo Tolstoy"],
    correctOption: "William Shakespeare",
    points: 1,
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["H2O", "O2", "CO2", "NaCl"],
    correctOption: "H2O",
    points: 1,
  },
];

// We need to define the initialState in order to use useReducer Hook.
const initialState = {
  questions: hardcodedQuestions,
  status: "ready", // Start as ready since we have questions
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: hardcodedQuestions.length * SECS_PER_QUESTION,
};

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION, // Reset the timer
      };

      case "newAnswer":
        const question = state.questions[state.index];
      
        return {
          ...state,
          answer: action.payload,
          points:
            action.payload === question.options.indexOf(question.correctOption)
              ? state.points + question.points
              : state.points, // Only increase points if the answer is correct
        };
      

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1, // Move to the next question
        answer: null, // Reset the answer for the next question
      };

    case "finish":
      return {
        ...state,
        status: "finished", // Mark the quiz as finished
        highscore: state.points > state.highscore ? state.points : state.highscore, // Update highscore
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions, // Keep the same questions
        highscore: state.highscore, // Retain the highscore
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1, // Decrement the timer
        status: state.secondsRemaining === 0 ? "finished" : state.status, // Finish quiz if time runs out
      };

    default:
      throw new Error("Unknown action type");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    const timer =
      status === "active" &&
      setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);

    return () => clearInterval(timer);
  }, [status]); // Ensure timer only runs when active

  return (
    <div className="wrapper">
      <div className="app">
        <div className="headerWrapper">
          <Header />

          <Main>
            {status === "loading" && <Loader />}
            {status === "error" && <Error />}
            {status === "ready" && (
              <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
            )}
            {status === "active" && (
              <>
                <Progress
                  index={index}
                  numQuestions={numQuestions}
                  points={points}
                  maxPossiblePoints={maxPossiblePoints}
                  answer={answer}
                />
                <Question
                  question={questions[index]}
                  dispatch={dispatch}
                  answer={answer}
                />
                <Footer>
                  <Timer
                    dispatch={dispatch}
                    secondsRemaining={secondsRemaining}
                  />
                  <NextButton
                    dispatch={dispatch}
                    answer={answer}
                    numQuestions={numQuestions}
                    index={index}
                  />
                </Footer>
              </>
            )}
            {status === "finished" && (
              <FinishScreen
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                highscore={highscore}
                dispatch={dispatch}
              />
            )}
          </Main>
        </div>
      </div>
    </div>
  );
}
