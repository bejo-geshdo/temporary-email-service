import { useState } from "react";
import DeleteModal from "../Modals/DeleteModal";

export const DeleteAddress = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button className="delete" onClick={() => setShowModal(true)}>
        Delete address 🗑️
      </button>
      {showModal && <DeleteModal setShowModal={setShowModal} />}
    </>
  );
};
