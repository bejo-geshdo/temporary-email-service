async function newAddress(apiUrl: string, secret: string) {
  const res = await fetch(`${apiUrl}newAddress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ secret: secret }),
  });
  const data = await res.json();
  return data;
}

export default newAddress;
