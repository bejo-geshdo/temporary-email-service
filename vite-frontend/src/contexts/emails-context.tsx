import React, { createContext, useContext, useEffect, useState } from "react";
import { EmailAddress, useAddressContext } from "./address-context";
import getEmails from "../utils/getEmails";

type EmailsContextProviderProps = {
  children: React.ReactNode;
};

export type Email = {
  subject: string;
  from: string; //Name + address like "John Doe <john.doe@test.com>
  from_address: EmailAddress;
  email: EmailAddress; //should be renamed to "to"
  teaster: string;
  domain: string;
  created_at: number;
  //Metadata
  messageId: string;
  spamVerdict: string;
  virusVerdict: string;
  to: EmailAddress[]; //A list of email addresses that the email was sent to
  //DB fields
  sk: string;
  pk: string | EmailAddress;
  ttl: number;
};

export type Emails = Email[];

type EmailsContext = {
  emails: Emails;
  setEmails: React.Dispatch<React.SetStateAction<Emails>>;
};

export const EmailsContext = createContext<EmailsContext | null>(null);

export default function EmailsContextProvider({
  children,
}: EmailsContextProviderProps) {
  const [emails, setEmails] = useState<Emails>([]);
  const { address } = useAddressContext();

  const apiUrl = "https://mxpd0fy4ji.execute-api.eu-west-1.amazonaws.com/dev/";

  //TODO Change from short polling to websockets
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchEmails = () => {
      const now = Date.now();
      if (address && address.ttl > Math.floor(now / 1000)) {
        console.log("Fetching emails");
        getEmails(address.address, apiUrl).then((data) => {
          setEmails(data);
        });
      } else {
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    // Call it once immediately
    fetchEmails();

    // Then set up the interval
    intervalId = setInterval(fetchEmails, 10000); // 10000 ms = 10 s

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [address]);

  return (
    <EmailsContext.Provider value={{ emails, setEmails }}>
      {children}
    </EmailsContext.Provider>
  );
}

export function useEmailsContext() {
  const context = useContext(EmailsContext);
  if (!context) {
    throw new Error(
      "useEmailsContext must be used within a EmailsContextProvider"
    );
  }
  return context;
}
