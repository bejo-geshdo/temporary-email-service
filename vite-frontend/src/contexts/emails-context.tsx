import React, { createContext, useContext, useState } from "react";
import { EmailAddress } from "./address-context";

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
