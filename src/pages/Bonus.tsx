import { useState } from "react";

const BASE_URL = import.meta.env.BASE_URL;

const Bonus = () => {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="page">
      <div className="card fade-in">
        <h1 className="hero">Bonus</h1>
        <p className="subtitle">Une petite vidéo rien que pour toi.</p>
        <div className="video-box">
          {videoError ? (
            <div className="video-placeholder">
              Ajoute /public/assets/bonus.mp4
            </div>
          ) : (
            <video
              controls
              playsInline
              onError={() => setVideoError(true)}
              src={`${BASE_URL}assets/bonus.mp4`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Bonus;
