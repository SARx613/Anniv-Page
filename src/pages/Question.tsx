import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoButtonDodge from "../components/NoButtonDodge";

const Question = () => {
  const navigate = useNavigate();
  const [yesClicks, setYesClicks] = useState(0);
  const requiredClicks = 3;
  const clicksLeft = Math.max(0, requiredClicks - yesClicks);
  const scale = 1 + yesClicks * 0.18;
  const fontSize = 16 + yesClicks * 4;

  const handleYesClick = () => {
    if (yesClicks + 1 >= requiredClicks) {
      navigate("/celebration");
      return;
    }
    setYesClicks((prev) => prev + 1);
  };

  return (
    <div className="page">
      <div className="card fade-in">
        <h1 className="hero">
          T'es libre ce soir vers 19h à Châtelet pour sortir avec moi ?
        </h1>
        <p className="subtitle">Essaie quand même de cliquer sur NON 😉</p>
        <NoButtonDodge label="Non">
          <button
            type="button"
            className="button button-primary"
            onClick={handleYesClick}
            style={{
              transform: `scale(${scale})`,
              fontSize: `${fontSize}px`,
            }}
          >
            {clicksLeft > 1 ? `Oui` : "Oui"}
          </button>
        </NoButtonDodge>
      </div>
    </div>
  );
};

export default Question;
