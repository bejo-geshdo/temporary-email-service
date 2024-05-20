import { useAddressContext } from "../../contexts/address-context";
import deleteAddress from "../../utils/deleteAddress";
import newAddress from "../../utils/newAddress";

type DeleteModalProps = {
  setShowModal: (value: boolean) => void;
};

const apiUrl =
  import.meta.env.VITE_API_URL || "https://api.dev.inboxdev.castrojonsson.se/";

const DeleteModal = ({ setShowModal }: DeleteModalProps) => {
  const { address, setAddress } = useAddressContext();

  const handleDeleteAddress = async () => {
    try {
      await deleteAddress(address.address, apiUrl);
      localStorage.removeItem("address");
      setAddress({ msg: "", address: "", ttl: 0, secret: "" });

      newAddress(apiUrl).then((data) => {
        localStorage.setItem("address", JSON.stringify(data));
        setAddress(data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this address?</p>
        <button
          className="delete"
          onClick={() => handleDeleteAddress().then(() => setShowModal(false))}
        >
          Confirm
        </button>
        <button onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteModal;
