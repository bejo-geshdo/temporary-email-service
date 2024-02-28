import { useState, useEffect } from "react";

import newAddress from "../utils/newAddress";
import deleteAddress from "../utils/deleteAddress";
import CountDown from "../components/CountDown";
import DeleteAddress from "../components/DeleteAddress";

// const apiUrl = process.env.REACT_APP_API_URL
//   ? process.env.REACT_APP_API_URL
//   : "https://api.dev.inboxdev.castrojonsson.se/";
const apiUrl = "https://mxpd0fy4ji.execute-api.eu-west-1.amazonaws.com/dev/";
const secret = "password123";
//TODO Change secret to randomized and store in state

export interface Address {
  msg: string;
  address: string;
  ttl: number;
}

export const EmailClient = () => {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<Address>({
    msg: "",
    address: "",
    ttl: 0,
  });
  // const [emails, setEmails] = useState([]);
  // const [minutes, setMinutes] = useState(0);
  // const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const savedAddress = localStorage.getItem("address");
    if (!savedAddress || !JSON.parse(savedAddress)) {
      newAddress(apiUrl, secret).then((data) => {
        localStorage.setItem("address", JSON.stringify(data));
        setAddress(data);
        setLoading(false);
      });
    } else {
      setAddress(JSON.parse(savedAddress));
      setLoading(false);
    }
  }, []);

  const handleDeleteAddress = async (address: string, apiUrl: string) => {
    setLoading(true);
    deleteAddress(address, apiUrl);
    localStorage.removeItem("address");
    newAddress(apiUrl, secret).then((data) => {
      localStorage.setItem("address", JSON.stringify(data));
      setAddress(data);
      setLoading(false);
    });
  };

  return (
    <div>
      <h1>Temporary serverless email experiment</h1>

      <p>This page let's you create a temporary email address</p>
      <p>The address and emails will be deleted after 10 minutes</p>
      <p>The address and emails can be renewed by 10 minutes up 24h</p>

      <p>Link to the API docs: </p>

      <a href={window.location.href + "docs"}>
        {window.location.href + "docs"}
      </a>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>{address.address}</p>
          <DeleteAddress
            address={address.address}
            apiUrl={apiUrl}
            deleteAddress={handleDeleteAddress}
          />
          <CountDown ttl={address.ttl} />
        </>
      )}
    </div>
  );
};
