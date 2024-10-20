import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  useEffect(() => {
    // Start the timer
    const id = setInterval(() => {
      // Only dispatch if there are seconds remaining
      if (secondsRemaining > 0) {
        dispatch({ type: "tick" });
      }
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(id);
  }, [dispatch, secondsRemaining]); // Add secondsRemaining to the dependency array

  return (
    <div className="timer">
      {mins < 10 ? "0" : ""}
      {mins}:{seconds < 10 ? "0" : ""}
      {seconds}
    </div>
  );
}

export default Timer;
