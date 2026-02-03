import { useNavigate } from "react-router-dom";
import NoButtonDodge from "../components/NoButtonDodge";

const Question = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate("/celebration")}
          >
            Oui
          </button>
        </NoButtonDodge>
      </div>
    </div>
  );
};

export default Question;
