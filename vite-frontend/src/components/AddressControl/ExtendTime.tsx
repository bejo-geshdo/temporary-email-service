import { useAddressContext } from "../../contexts/address-context";
import extendTime from "../../utils/extendTime";

const apiUrl =
  import.meta.env.VITE_API_URL || "https://api.dev.inboxdev.castrojonsson.se/";

//TODO disabled button if time has run out
const ExtendTimeButton = () => {
  const { address, setAddress } = useAddressContext();

  const handleExtendTime = async () => {
    extendTime(apiUrl, address.address, address.secret).then((data) => {
      localStorage.setItem(
        "address",
        JSON.stringify({ ...address, ttl: data.ttl })
      );
      setAddress({ ...address, ttl: data.ttl });
    });
  };

  return <button onClick={() => handleExtendTime()}>🔄</button>;
};

export default ExtendTimeButton;
