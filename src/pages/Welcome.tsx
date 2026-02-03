import { useNavigate } from "react-router-dom";
import HeartRain from "../components/HeartRain";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <HeartRain />
      <div className="card fade-in">
        <h1 className="hero">Joyeux anniversaire mon Amour ❤️❤️❤️</h1>
        <p className="subtitle">
          Merci de me donner le sourire chaque jour de ma vie !!
        </p>
        <div className="buttons">
          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate("/question")}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
