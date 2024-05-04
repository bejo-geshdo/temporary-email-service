import { Emails } from "../contexts/emails-context";

interface GetEmail {
  msg: string;
  emails: Emails;
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
