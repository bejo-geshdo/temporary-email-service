import React, { useEffect, useState } from "react";
import { Letter } from "react-letter";
import { extract, LetterparserMail } from "letterparser";

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

  if (!email || email === null) return <div>Loading...</div>;

  return (
    <div>
      <div
        style={{
          backgroundColor: "cornsilk",
          padding: "1em",
          paddingTop: "0.5em",
          borderRadius: "1em",
          marginBottom: "1em",
        }}
      >
        <h3 style={{ margin: "0.2em", marginLeft: "0" }}>{email?.subject}</h3>
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
      <div
        style={{
          backgroundColor: "ghostwhite",
          padding: "1em",
          borderRadius: "1em",
        }}
      >
        <Letter
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
