import style from "./AddressControl.module.css";
import TimerClock from "../CountDown/TimerClock";
import { useAddressContext } from "../../contexts/address-context";
import { DeleteAddress } from "./DeleteAddress";
import ExtendTimeButton from "./ExtendTime";

const AddressControl = () => {
  const { address } = useAddressContext();

  async function copyTextToClipboard(text: string) {
    return await navigator.clipboard.writeText(text);
  }

  return (
    <>
      <div className={style.addressContiner}>
        <div className={style.addressControll}>
          <div className={style.address}>
            <p className={style.addressName}>{address.address}</p>
          </div>
          <div className={style.addressTimer}>
            <TimerClock />
            <ExtendTimeButton />
            <button
              className="CopyButton"
              onClick={() => copyTextToClipboard(address.address)}
            >
              📋
            </button>
          </div>
        </div>
        <DeleteAddress />
      </div>
    </>
  );
};

export default AddressControl;
