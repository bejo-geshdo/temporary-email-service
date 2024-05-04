import ProgressBar from "./ProgressBar";
import TimerClock from "./TimerClock";

const CountDown = () => {
  return (
    <div>
      <div style={{ margin: "0 10em 0 10em" }}>
        <TimerClock />
      </div>
      <ProgressBar />
    </div>
  );
};

export default CountDown;
