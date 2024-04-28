import React, { useEffect, useState } from "react";
import { Letter } from "react-letter";
import { extract, LetterparserMail } from "letterparser";

import style from "./DisplayEml.module.css";
import { getDownloadUrl, rewriteSrc } from "../utils/handelEml";

interface DisplayEmlProps {
  apiUrl: string;
  messageId: string;
}

const DisplayEml: React.FC<DisplayEmlProps> = ({ apiUrl, messageId }) => {
  const [email, setemail] = useState<LetterparserMail | null>(null);

  useEffect(() => {
    getDownloadUrl(apiUrl, messageId).then((emlUrl) => {
      fetch(emlUrl)
        .then((response) => response.text())
        .then((emlContent) => {
          const newParser = extract(emlContent);
          setemail(newParser);
        });
    });
  }, [apiUrl, messageId]);

  if (!email || email === null)
    return (
      <div className={style.container}>
        <div className={`${style.emailHeader} ${style.loading}`}>
          <h3>Loading...</h3>
        </div>
        <div className={style.emlViewer}>
          <h3>Loading...</h3>
        </div>
      </div>
    );

  return (
    <div className={style.container}>
      <div className={style.emailHeader}>
        <h3>{email?.subject}</h3>
        <p>
          <strong>From:</strong> {email?.from?.name} &lt;{email?.from?.address}
          &gt;
        </p>
        <p>
          <strong>To:</strong> {email?.to?.map((to) => to.name).join(", ")}
        </p>
        {email?.cc && email?.cc.length > 0 && (
          <p>
            <strong>Cc:</strong> {email?.cc?.map((cc) => cc.name).join(", ")}
          </p>
        )}
      </div>

      <div className={style.scrollableContent}>
        <Letter
          className={style.emlViewer}
          html={email?.html ? email?.html : ""}
          text={email?.text}
          rewriteExternalResources={(url) =>
            rewriteSrc(url, email?.attachments || [])
          }
          allowedSchemas={["http", "https", "mailto", "cid"]}
        />
      </div>
    </div>
  );
};

export default DisplayEml;
