import { useMemo } from "react";

type Heart = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
};

const colors = ["#ff4d8d", "#ff7ab2", "#ffb3d1", "#ff96bf"];

const HeartRain = ({ count = 36 }: { count?: number }) => {
  const hearts = useMemo<Heart[]>(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        size: 10 + Math.random() * 16,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 8,
        opacity: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })),
    [count]
  );

  return (
    <div className="heart-rain" aria-hidden="true">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart"
          style={
            {
              "--left": `${heart.left}%`,
              "--size": `${heart.size}px`,
              "--delay": `${heart.delay}s`,
              "--duration": `${heart.duration}s`,
              "--opacity": heart.opacity.toString(),
              "--color": heart.color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default HeartRain;
