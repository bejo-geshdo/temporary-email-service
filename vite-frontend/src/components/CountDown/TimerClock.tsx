import { useEffect, useState } from "react";

interface CountDownProps {
  ttl: number;
}

interface Time {
  minutes: number;
  seconds: number;
  secondsLeft: number;
}

const TimerClock = ({ ttl }: CountDownProps) => {
  const [time, setTime] = useState<Time>({
    minutes: 0,
    seconds: 0,
    secondsLeft: 0,
  });

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

  return (
    <div>
      <h2>Countdown</h2>
      <p>
        {time.minutes < 10 ? `0${time.minutes}` : time.minutes}:
        {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
      </p>
      <p>ttl: ${time.secondsLeft}</p>
    </div>
  );
};

export default TimerClock;
