import { useEffect, useState } from "react";

interface CountDownProps {
  ttl: number;
}

const CountDown = ({ ttl }: CountDownProps) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (ttl < Math.floor(Date.now() / 1000)) {
      setMinutes(0);
      setSeconds(0);
    } else {
      const remainingTime = ttl - Math.floor(Date.now() / 1000);
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;

      setMinutes(minutes);
      setSeconds(seconds);
    }
  }, [ttl]);

  return (
    <div>
      <h1>Countdown</h1>
      <p>
        {minutes}:{seconds}
      </p>
    </div>
  );
};

export default CountDown;
