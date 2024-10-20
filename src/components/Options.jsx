function Options({ question, dispatch, answer }) {
  const hasAnswered = answer !== null; // Check if user has answered

  return (
    <div>
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option 
            ${hasAnswered && index === question.options.indexOf(question.correctOption) ? "correct" : ""}
            ${hasAnswered && index !== question.options.indexOf(question.correctOption) && index === answer ? "wrong" : ""}
          `}
          key={index}
          disabled={hasAnswered} // Disable button once answered
          onClick={() => dispatch({ type: "newAnswer", payload: index })} // Handle answer click
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
