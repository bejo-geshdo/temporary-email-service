import { useState, useEffect } from "react";

import newAddress from "../utils/newAddress";
import deleteAddress from "../utils/deleteAddress";
import extendTime from "../utils/extendTime";
import CountDown from "../components/CountDown/CountDown";
import getEmails from "../utils/getEmails";
import DisplayEmails from "../components/DisplayEmails/DisplayEmails";

import { useAddressContext } from "../contexts/address-context";
import { useEmailsContext } from "../contexts/emails-context";
import AddressControl from "../components/AddressControl/AddressControl";

// const apiUrl = process.env.REACT_APP_API_URL
//   ? process.env.REACT_APP_API_URL
//   : "https://api.dev.inboxdev.castrojonsson.se/";
const apiUrl = "https://mxpd0fy4ji.execute-api.eu-west-1.amazonaws.com/dev/";
const secret = "password123";
//TODO Change secret to randomized and store in state

export const EmailClient = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { address, setAddress } = useAddressContext();
  const { emails, setEmails } = useEmailsContext();

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

  const handleExtendTime = async (address: string, apiUrl: string) => {
    extendTime(apiUrl, address, secret).then((data) => {
      localStorage.setItem("address", JSON.stringify(data));
      setAddress(data);
    });
  };

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
          <p>{address.address}</p>
          <div>
            <button className="delete" onClick={() => setShowModal(true)}>
              Delete Address: {address.address}
            </button>
            <button onClick={() => handleExtendTime(address.address, apiUrl)}>
              Extend time by 10 minutes
            </button>
          </div>

          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this address?</p>
                <button
                  className="delete"
                  onClick={() =>
                    handleDeleteAddress(address.address, apiUrl).then(() =>
                      setShowModal(false)
                    )
                  }
                >
                  Confirm
                </button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          )}
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
