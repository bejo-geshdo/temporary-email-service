import { Email } from "../containers/EmailClient";

interface GetEmail {
  msg: string;
  emails: Email[];
}

async function getEmails(address: string, apiUrl: string) {
  const res = await fetch(`${apiUrl}getMails?email=${address}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: GetEmail = await res.json();

  return data.emails;
}

export default getEmails;
