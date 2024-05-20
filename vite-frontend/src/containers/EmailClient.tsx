import { useState, useEffect } from "react";
import DisplayEmails from "../components/DisplayEmails/DisplayEmails";
import { useAddressContext } from "../contexts/address-context";
import AddressControl from "../components/AddressControl/AddressControl";
import Hero from "../components/Hero/Hero";

const apiUrl =
  import.meta.env.VITE_API_URL || "https://api.dev.inboxdev.castrojonsson.se/";
// const apiUrl = "https://mxpd0fy4ji.execute-api.eu-west-1.amazonaws.com/dev/";

export const EmailClient = () => {
  const [loading, setLoading] = useState(true);

  const { address } = useAddressContext();

  useEffect(() => {
    if (address.address !== "") setLoading(false);
  }, [address]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Hero />
          <AddressControl />
          <DisplayEmails apiUrl={apiUrl} />
        </>
      )}
    </div>
  );
};
