import style from "./ListEmails.module.css";
import { useEmailsContext } from "../../contexts/emails-context";

interface DisplayEmailsProps {
  handleEmailClick: (messageId: string) => void;
}

const truncateSubject = (subject: string) => {
  if (!subject) return "No subject";
  return subject.length < 30 ? subject : `${subject.slice(0, 30)}...`;
};

const extractFromAddress = (from: string) => {
  return from ? from.split("<")[0] : "No from address";
};

const ListEmails = ({ handleEmailClick }: DisplayEmailsProps) => {
  const { emails } = useEmailsContext();

  return (
    <div className={style.emailList}>
      <p className={style.emailListCenter}>There are {emails.length} emails</p>
      <div className={style.scrollableContent}>
        {emails.map((email) => (
          <div key={email.messageId} className={style.emailDetails}>
            <p>{truncateSubject(email.subject)}</p>
            <p>
              <strong>Time: </strong>
              {""}
              {new Date(email.ttl * 1000).toLocaleString()}
            </p>
            <p>
              <strong>From:</strong> {extractFromAddress(email.from)}
            </p>
            <button onClick={() => handleEmailClick(email.messageId)}>
              Show/Hide Email
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListEmails;
