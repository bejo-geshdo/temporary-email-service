interface AdressProps {
  address: string;
  apiUrl: string;
  deleteAddress: (address: string, apiUrl: string) => void;
}

const DeleteAddress = ({ address, apiUrl, deleteAddress }: AdressProps) => {
  return (
    <>
      <button onClick={() => deleteAddress(address, apiUrl)}>
        Delete Address: {address}
      </button>
    </>
  );
};

export default DeleteAddress;
