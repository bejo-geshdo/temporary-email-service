async function deleteAddress(address: string, apiUrl: string) {
  await fetch(`${apiUrl}delete?address=${address}&type=address`, {
    method: "DELETE",
  });
}

export default deleteAddress;
