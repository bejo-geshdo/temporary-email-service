import { Address } from "../containers/EmailClient";

async function extendTime(apiUrl: string, address: string, secret: string) {
  const res = await fetch(`${apiUrl}extendTime?address=${address}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ secret: secret }),
  });
  const data: Address = await res.json();
  return data;
}

export default extendTime;
