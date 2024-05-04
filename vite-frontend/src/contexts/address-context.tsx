import React, { createContext, useContext, useState, useEffect } from "react";
import newAddress from "../utils/newAddress";

type AddressContextProviderProps = {
  children: React.ReactNode;
};

export type EmailAddress = {
  msg: string;
  address: string;
  ttl: number;
};

type AddressContext = {
  address: EmailAddress;
  setAddress: React.Dispatch<React.SetStateAction<EmailAddress>>;
};

export const AddressContext = createContext<AddressContext | null>(null);

export default function AddressContextProvider({
  children,
}: AddressContextProviderProps) {
  const [address, setAddress] = useState<EmailAddress>({
    msg: "",
    address: "",
    ttl: 0,
  });

  const apiUrl = "https://mxpd0fy4ji.execute-api.eu-west-1.amazonaws.com/dev/";
  const secret = "password123";

  useEffect(() => {
    const savedAddress = localStorage.getItem("address");
    if (!savedAddress || !JSON.parse(savedAddress)) {
      newAddress(apiUrl, secret).then((data) => {
        localStorage.setItem("address", JSON.stringify(data));
        setAddress(data);
      });
    } else {
      setAddress(JSON.parse(savedAddress));
    }
  }, []);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddressContext() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error(
      "useAddressContext must be used within a AddressContextProvider"
    );
  }
  return context;
}
