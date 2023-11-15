import React, { useState, useEffect } from "react";
import "./Timer.css";

const Timer = () => {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const [emails, setEmails] = useState([]);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const apiUrl = "https://c4y7ide9r8.execute-api.eu-west-1.amazonaws.com/dev/";

  useEffect(() => {
    fetch(`${apiUrl}newAddress`)
      .then((response) => response.json())
      .then((data) => {
        setAddress(data);
        setLoading(false);
        console.log(data);
      });
  }, []);

  const extendTime = async () => {
    const requestOptions = {
      method: "PUT",
    };

    const res = await fetch(
      `${apiUrl}extendTime?address=${address.address}`,
      requestOptions
    ).then((response) => response.json());
    setAddress({ ...address, ttl: res.ttl });
  };

  const deleteMail = async (sk) => {
    const requestOptions = {
      method: "DELETE",
    };

    const res = await fetch(
      `${apiUrl}delete?address=${address.address}&type=email&sk=${sk}`,
      requestOptions
    );
    //TODO remove email from state
    await handleClick();
  };

  const deleteAddress = async () => {
    const requestOptions = {
      method: "DELETE",
    };

    const res = await fetch(
      `${apiUrl}delete?address=${address.address}&type=address`,
      requestOptions
    );
  };

  const downloadEmail = async (messageId) => {
    const response = await fetch(
      `${apiUrl}getSingedUrls?messageId=${messageId}`
    ).then((response) => response.json());
    console.log(response);

    const blobResponse = await fetch(response.url);
    const blob = await blobResponse.blob();
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "test.eml"; // Use fileName here
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleClick = async () => {
    const res = await fetch(`${apiUrl}getMails?email=${address.address}`).then(
      (response) => response.json()
    );
    //const emails = res.data.emails;
    console.log(res.emails);
    setEmails(res.emails);
  };

  //TODO state is weird idk how to use it :(
  useEffect(() => {
    setInterval(async () => {
      if (address) {
        console.log("running");
        console.log(`${address.address}`);
        await handleClick();
      }
    }, 5000);
  }, [address]);

  useEffect(() => {
    if (address && address.ttl) {
      const remainingTime = address?.ttl - Math.floor(Date.now() / 1000);
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;

      setMinutes(minutes);
      setSeconds(seconds);
    }
  }, [address]);

  useEffect(() => {
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
  }, [minutes, seconds]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>TTL: {address?.ttl}</p>
          <button onClick={() => extendTime()}>
            Extend time by 10 minutes
          </button>
          <button onClick={() => deleteAddress()}>
            Delete email address: {address.address}
          </button>
          <p>Address: {address.address}</p>
          <div className="Timer">
            {minutes}:{seconds}
          </div>
          <div>
            <button onClick={() => handleClick()}>Get Emails</button>
          </div>
        </>
      )}
      {emails.length < 1 ? (
        <h2>No Emails yet</h2>
      ) : (
        <div>
          <p>There are {emails.length} emails</p>
          {emails.map((email) => {
            return (
              <div key={email.ttl}>
                <h2>{email.subject}</h2>
                <p>Time: {email.created_at}</p>
                <p>From: {email.from}</p>
                <button onClick={() => deleteMail(email.sk)}>
                  Delete mail
                </button>
                <button onClick={() => downloadEmail(email.messageId)}>
                  Download Email
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timer;
