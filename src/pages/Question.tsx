import { useNavigate } from "react-router-dom";
import NoButtonDodge from "../components/NoButtonDodge";

const Question = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="card fade-in">
        <h1 className="hero">Are you available tonight at 7 PM?</h1>
        <p className="subtitle">
          There is a date waiting for the birthday star.
        </p>
        <NoButtonDodge label="No">
          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate("/celebration")}
          >
            Yes
          </button>
        </NoButtonDodge>
      </div>
    </div>
  );
};

export default Question;
