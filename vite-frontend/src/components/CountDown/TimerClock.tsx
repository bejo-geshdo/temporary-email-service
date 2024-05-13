import { useEffect, useState } from "react";
import style from "./TimerClock.module.css";
import { useAddressContext } from "../../contexts/address-context";

interface Time {
  minutes: number;
  seconds: number;
  secondsLeft: number;
}

const TimerClock = () => {
  const [time, setTime] = useState<Time>({
    minutes: 0,
    seconds: 0,
    secondsLeft: 0,
  });

  const { address } = useAddressContext();

  useEffect(() => {
    let lastUpdate = Date.now();
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const delta = now - lastUpdate;

      if (delta >= 1000) {
        lastUpdate = now;

        if (address.ttl < Math.floor(now / 1000)) {
          setTime({ minutes: 0, seconds: 0, secondsLeft: 0 });
        } else {
          const remainingTime = address.ttl - Math.floor(now / 1000);
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          const secondsLeft = address.ttl - Math.floor(now / 1000);

          setTime({ minutes, seconds, secondsLeft });
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick(); // start the loop

    return () => cancelAnimationFrame(animationFrameId);
  }, [address.ttl]);

  return (
    <div>
      <div className={style.clockContainer}>
        <p>
          {/* TODO investigate why spans change size all the time*/}
          <span className={style.number}>
            {time.minutes < 10 ? `0${time.minutes}` : time.minutes}
          </span>
          :
          <span className={style.number}>
            {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TimerClock;
