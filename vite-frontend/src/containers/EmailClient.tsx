import { useState, useEffect } from "react";

// import extendTime from "../utils/extendTime";
// import CountDown from "../components/CountDown/CountDown";
import getEmails from "../utils/getEmails";
import DisplayEmails from "../components/DisplayEmails/DisplayEmails";

import { useAddressContext } from "../contexts/address-context";
import { useEmailsContext } from "../contexts/emails-context";
import AddressControl from "../components/AddressControl/AddressControl";
import Hero from "../components/Hero/Hero";

// const apiUrl = process.env.REACT_APP_API_URL
//   ? process.env.REACT_APP_API_URL
//   : "https://api.dev.inboxdev.castrojonsson.se/";
const apiUrl = "https://mxpd0fy4ji.execute-api.eu-west-1.amazonaws.com/dev/";

export const EmailClient = () => {
  const [loading, setLoading] = useState(true);

  const { address } = useAddressContext();
  const { emails, setEmails } = useEmailsContext();

  useEffect(() => {
    if (address.address !== "") setLoading(false);
  }, [address]);

  const handleGetEmails = async (address: string, apiUrl: string) => {
    getEmails(address, apiUrl).then((data) => {
      setEmails(data);
      console.log(emails);
    });
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Hero />
          <AddressControl />
          {/* <CountDown /> */}
          <button onClick={() => handleGetEmails(address.address, apiUrl)}>
            Get Emails
          </button>
          <DisplayEmails apiUrl={apiUrl} />
        </>
      )}
    </div>
  );
};
