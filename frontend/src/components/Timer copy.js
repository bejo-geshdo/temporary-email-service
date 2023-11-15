import React, { useState, useEffect } from 'react';
import "./Timer.css"

const Timer = () => {
 const [unixTimestamp, setUnixTimestamp] = useState(null);
 const [minutes, setMinutes] = useState(0);
 const [seconds, setSeconds] = useState(0);

 useEffect(() => {
   fetch('https://c4y7ide9r8.execute-api.eu-west-1.amazonaws.com/dev/newAddress')
     .then(response => response.json())
     .then(data => setUnixTimestamp(data.ttl));
 }, []);

 useEffect(() => {
   if (unixTimestamp) {
    const interval = setInterval(() => {
     const remainingTime = unixTimestamp - Math.floor(Date.now() / 1000);
     const minutes = Math.floor(remainingTime / 60);
     const seconds = remainingTime % 60;

     setMinutes(minutes);
     setSeconds(seconds);
     if (remainingTime <= 0) {
      clearInterval(interval);
    }
  }, 1000);

     let timer;
     if (seconds > 0) {
       timer = setInterval(() => {
         setSeconds(seconds - 1);
       }, 1000);
     } else if (seconds === 0 && minutes === 0) {
       clearInterval(timer);
     } else if (seconds === 0) {
       setMinutes(minutes - 1);
       setSeconds(59);
     }
     return () => clearInterval(timer);
   }
 }, [unixTimestamp]);

 return (
   <div className='Timer'>
     {minutes}:{seconds}
   </div>
 );
};

export default Timer;
