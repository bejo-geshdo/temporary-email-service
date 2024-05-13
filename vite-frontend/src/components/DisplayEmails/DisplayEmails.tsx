import { useState } from "react";
import style from "./DisplayEmails.module.css";
import DisplayEml from "./DisplayEml";
import ListEmails from "./ListEmails";

interface DisplayEmailsProps {
  apiUrl: string;
}

const DisplayEmails = ({ apiUrl }: DisplayEmailsProps) => {
  const [activeEmail, setActiveEmail] = useState<string | null>(null);

  const handleEmailClick = (messageId: string) => {
    setActiveEmail((prevMessageId) =>
      prevMessageId === messageId ? null : messageId
    );
  };

  return (
    <div className={style.emailContainer}>
      <ListEmails handleEmailClick={handleEmailClick} />
      <div className={style.emailItem}>
        {activeEmail ? (
          <DisplayEml apiUrl={apiUrl} messageId={activeEmail} />
        ) : (
          <div className={style.emailItemPlaceholder}>
            <p>Please select an email to read</p>
            <img
              src="https://res.cdn.office.net/assets/mail/illustrations/noMailSelected/v2/light.svg"
              alt="Email icon"
            />
            <p>No email selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayEmails;
