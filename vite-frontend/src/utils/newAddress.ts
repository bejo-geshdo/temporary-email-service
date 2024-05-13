import { generateRandomString } from "./utils";

async function newAddress(apiUrl: string) {
  const secret2 = generateRandomString(10);

  const res = await fetch(`${apiUrl}newAddress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ secret: secret2 }),
  });
  const data = await res.json();
  return { ...data, secret: secret2 };
}

export default newAddress;
