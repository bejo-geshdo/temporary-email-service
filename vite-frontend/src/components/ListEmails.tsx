import style from "./DisplayEmails.module.css";
import { Email } from "../containers/EmailClient";

interface DisplayEmailsProps {
  emails: Email[];
  handleEmailClick: (messageId: string) => void;
}

const ListEmails = ({ emails, handleEmailClick }: DisplayEmailsProps) => {
  return (
    <>
      <div className={style.emailList}>
        <p className={style.emailListCenter}>
          There are {emails.length} emails
        </p>
        {emails.map((email) => (
          <div className={style.emailDetails}>
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
    </>
  );
};

export default ListEmails;
