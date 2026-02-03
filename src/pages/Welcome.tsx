import { useNavigate } from "react-router-dom";
import HeartRain from "../components/HeartRain";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <HeartRain />
      <div className="card fade-in">
        <h1 className="hero">Happy Birthday Hanna</h1>
        <p className="subtitle">
          I made this little corner of the internet just for you. There are a
          few surprises waiting.
        </p>
        <div className="buttons">
          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate("/question")}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
