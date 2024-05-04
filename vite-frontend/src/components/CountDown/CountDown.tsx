import ProgressBar from "./ProgressBar";
import TimerClock from "./TimerClock";

interface CountDownProps {
  ttl: number;
}

const CountDown = ({ ttl }: CountDownProps) => {
  return (
    <div>
      <div style={{ margin: "0 10em 0 10em" }}>
        <TimerClock ttl={ttl} />
      </div>
      <ProgressBar ttl={ttl} />
    </div>
  );
};

export default CountDown;
