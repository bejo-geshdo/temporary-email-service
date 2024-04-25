import { useState } from "react";
import style from "./DisplayEmails.module.css";
import { Email } from "../containers/EmailClient";
import DisplayEml from "./DisplayEml";
import ListEmails from "./ListEmails";

interface DisplayEmailsProps {
  apiUrl: string;
  emails: Email[];
}

const DisplayEmails = ({ apiUrl, emails }: DisplayEmailsProps) => {
  const [activeEmail, setActiveEmail] = useState<string | null>(null);

  const handleEmailClick = (messageId: string) => {
    setActiveEmail((prevMessageId) =>
      prevMessageId === messageId ? null : messageId
    );
  };

  return (
    <>
      <h2>Emails</h2>

      <div className={style.emailContainer}>
        <ListEmails emails={emails} handleEmailClick={handleEmailClick} />
        <div className={style.emailItem}>
          {activeEmail ? (
            <DisplayEml apiUrl={apiUrl} messageId={activeEmail} />
          ) : (
            <p>Your email will be displayed here</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayEmails;
