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
    // Add some info to the top of the email about the email
    // From name and email address, date, subject, and any other relevant info
    <Letter
      html={email?.html ? email?.html : ""}
      text={email?.text}
      rewriteExternalResources={(url) =>
        rewriteSrc(url, email?.attachments || [])
      }
      allowedSchemas={["http", "https", "mailto", "cid"]}
    />
  );
};

export default DisplayEml;
