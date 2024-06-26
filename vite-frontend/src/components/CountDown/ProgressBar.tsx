import React, { useEffect, useState } from "react";
import style from "./ProgressBar.module.css";
import { useAddressContext } from "../../contexts/address-context";

const ProgressBar = () => {
  const [animationTime, setAnimationTime] = useState(0);

  const { address } = useAddressContext();

  useEffect(() => {
    const seconds = address.ttl - Math.floor(Date.now() / 1000);

    setAnimationTime(seconds);
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div
      className={`${style.progressBar} ${style.fadeAway}`}
      style={
        {
          "--start-position": `-${100 - (animationTime / 600) * 100}%`,
          "--animation-time": `${animationTime}s`,
          animationDelay: `-${animationTime / 600}s`,
        } as React.CSSProperties
      }
    ></div>
  );
};

export default ProgressBar;
