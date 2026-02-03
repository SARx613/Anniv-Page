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
    { src: "/assets/photo1.jpg", label: "Add photo1.jpg" },
    { src: "/assets/photo2.jpg", label: "Add photo2.jpg" },
    { src: "/assets/photo3.jpg", label: "Add photo3.jpg" },
    { src: "/assets/photo4.jpg", label: "Add photo4.jpg" },
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
        <h1 className="hero">Yes! Let us celebrate you.</h1>
        <p className="subtitle">
          I cannot wait for tonight. Until then, here are some favorite moments
          and a little love note.
        </p>
        <div className="note">
          Hanna, you make every day brighter. Thank you for being the most
          caring, joyful, and inspiring person in my life. Happy birthday.
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
            {playing ? "Pause music" : "Play music"}
          </button>
          {audioError ? (
            <span className="subtitle">
              Add /public/assets/song.mp3 for music.
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
