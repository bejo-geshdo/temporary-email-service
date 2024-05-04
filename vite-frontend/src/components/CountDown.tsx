import { useEffect, useState } from "react";
import style from "./CountDown.module.css";
import React from "react";

interface CountDownProps {
  ttl: number;
}

interface Time {
  minutes: number;
  seconds: number;
  secondsLeft: number;
}

const CountDown = ({ ttl }: CountDownProps) => {
  const [time, setTime] = useState<Time>({
    minutes: 0,
    seconds: 0,
    secondsLeft: 0,
  });
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    let lastUpdate = Date.now();
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const delta = now - lastUpdate;

      if (delta >= 1000) {
        lastUpdate = now;

        if (ttl < Math.floor(now / 1000)) {
          setTime({ minutes: 0, seconds: 0, secondsLeft: 0 });
        } else {
          const remainingTime = ttl - Math.floor(now / 1000);
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          const secondsLeft = ttl - Math.floor(now / 1000);

          setTime({ minutes, seconds, secondsLeft });
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick(); // start the loop

    return () => cancelAnimationFrame(animationFrameId);
  }, [ttl]);

  useEffect(() => {
    const seconds = ttl - Math.floor(Date.now() / 1000);

    setAnimationTime(seconds);
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div style={{ margin: "10em" }}>
      <h2>Countdown</h2>
      <p>
        {time.minutes < 10 ? `0${time.minutes}` : time.minutes}:
        {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
      </p>
      <p>ttl: ${time.secondsLeft}</p>
      <div
        className={`${style.countdownBar} ${style.fadeAway}`}
        style={
          {
            "--start-position": `-${100 - (animationTime / 600) * 100}%`,
            "--animation-time": `${animationTime}s`,
            animationDelay: `-${animationTime / 600}s`,
          } as React.CSSProperties
        }
      ></div>
    </div>
  );
};

export default CountDown;
