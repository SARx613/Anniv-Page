import { useMemo, useRef, useState } from "react";

type ConfettiPiece = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
};

const confettiColors = ["#ff4d8d", "#ff9ac4", "#ffd166", "#7bdff2", "#9b5de5"];

const PhotoTile = ({ src, label }: { src: string; label: string }) => {
  const [error, setError] = useState(false);

  return (
    <div className="photo-tile">
      {error ? (
        <div className="photo-placeholder">{label}</div>
      ) : (
        <img src={src} alt={label} onError={() => setError(true)} />
      )}
    </div>
  );
};

const Celebration = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [giftError, setGiftError] = useState(false);

  const confetti = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 50 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        size: 8 + Math.random() * 10,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
        rotate: Math.random() * 180,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      })),
    []
  );

  const photos = [
    { src: "/assets/photo1.jpg", label: "Ajoute photo1.jpg" },
    { src: "/assets/photo2.jpg", label: "Ajoute photo2.jpg" },
    { src: "/assets/photo3.jpg", label: "Ajoute photo3.jpg" },
    { src: "/assets/photo4.jpg", label: "Ajoute photo4.jpg" },
  ];

  const toggleMusic = async () => {
    if (!audioRef.current || audioError) {
      return;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch (error) {
      setAudioError(true);
    }
  };

  return (
    <div className="page">
      <div className="confetti-wrap" aria-hidden="true">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti"
            style={
              {
                "--left": `${piece.left}%`,
                "--size": `${piece.size}px`,
                "--delay": `${piece.delay}s`,
                "--duration": `${piece.duration}s`,
                "--rotate": `${piece.rotate}deg`,
                "--color": piece.color,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="card celebration fade-in">
        <h1 className="hero">Yallaaaa</h1>
        <p className="subtitle">Tu mérites alors quelque chose</p>
        <div className="gift-area">
          {!giftOpened ? (
            <button
              type="button"
              className="gift-button"
              onClick={() => setGiftOpened(true)}
            >
              {giftError ? (
                <div className="photo-placeholder">
                  Ajoute /public/assets/gift.png
                </div>
              ) : (
                <img
                  className="gift-image"
                  src="/assets/gift.png"
                  alt="Cadeau"
                  onError={() => setGiftError(true)}
                />
              )}
              <span className="gift-hint">Clique sur le cadeau</span>
            </button>
          ) : (
            <div className="gift-opened">
              <div className="gift-burst" aria-hidden="true" />
              <div className="note">
                <p>
                  Mon amour, ça fait bientôt 3 ans que tu remplis ma vie de joie.
                </p>
                <p>
                  Tu es la plus forte, la plus lumineuse, et tu me donnes envie
                  d'être meilleur chaque jour.
                </p>
                <p>
                  Dans un mois je pars 6 mois en Argentine, et tu vas
                  terriblement me manquer… mais je t'emporte partout avec moi.
                </p>
                <p>
                  L'an prochain pour ton alyah, je serai ton premier supporter.
                </p>
                <p>Je t'aime fort, très fort.</p>
              </div>
            </div>
          )}
        </div>
        <div className="photo-grid">
          {photos.map((photo) => (
            <PhotoTile key={photo.src} src={photo.src} label={photo.label} />
          ))}
        </div>
        <div className="music-toggle">
          <button
            type="button"
            className="button button-primary"
            onClick={toggleMusic}
          >
            {playing ? "Mettre en pause" : "Lancer la musique"}
          </button>
          {audioError ? (
            <span className="subtitle">
              Ajoute /public/assets/song.mp3 pour la musique.
            </span>
          ) : null}
        </div>
        <audio
          ref={audioRef}
          src="/assets/song.mp3"
          onError={() => setAudioError(true)}
        />
      </div>
    </div>
  );
};

export default Celebration;
