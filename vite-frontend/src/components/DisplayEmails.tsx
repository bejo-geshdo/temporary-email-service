import { useState } from "react";
import { Email } from "../containers/EmailClient";
import DisplayEml from "./DisplayEml";

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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxHeight: "80vh",
          maxWidth: "100vw",
          overflow: "auto",
        }}
      >
        <div
          style={{
            border: "2px solid black",
            flex: 1,
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <p>There are {emails.length} emails</p>
          {emails.map((email) => (
            <div
              style={{
                border: "1px solid black",
                margin: "5px",
                padding: "5px",
              }}
            >
              <p>
                {email.subject
                  ? email.subject.length < 30
                    ? email.subject
                    : `${email.subject.slice(0, 30)}...`
                  : "No subject"}
              </p>
              <p>
                <strong>Time: </strong>
                {""}
                {new Date(email.ttl * 1000).toLocaleString()}
              </p>
              <p>
                <strong>From:</strong>{" "}
                {email.from ? email.from.split("<")[0] : "No from address"}
              </p>
              <button onClick={() => handleEmailClick(email.messageId)}>
                Show/Hide Email
              </button>
            </div>
          ))}
        </div>
        <div
          style={{
            flex: 4,
            paddingLeft: "10px",
            color: "black",
            height: "80vh",
            overflow: "auto",
            backgroundColor: "ghostwhite",
          }}
        >
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
