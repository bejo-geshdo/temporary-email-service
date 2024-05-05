import React, { createContext, useContext, useState, useEffect } from "react";
import newAddress from "../utils/newAddress";
type AddressContextProviderProps = {
  children: React.ReactNode;
};

export type EmailAddress = {
  msg: string;
  address: string;
  ttl: number;
  secret: string;
};

const EmailAddressSchema = {
  msg: "string",
  address: "string",
  ttl: "number",
  secret: "string",
};

type AddressContext = {
  address: EmailAddress;
  setAddress: React.Dispatch<React.SetStateAction<EmailAddress>>;
};

export function isEmailAddress(obj: any): obj is EmailAddress {
  return Object.entries(EmailAddressSchema).every(
    ([key, type]) => key in obj && typeof obj[key] === type
  );
}

export const AddressContext = createContext<AddressContext | null>(null);

export default function AddressContextProvider({
  children,
}: AddressContextProviderProps) {
  const [address, setAddress] = useState<EmailAddress>({
    msg: "",
    address: "",
    ttl: 0,
    secret: "",
  });

  const apiUrl = "https://mxpd0fy4ji.execute-api.eu-west-1.amazonaws.com/dev/";

  useEffect(() => {
    const savedAddress = localStorage.getItem("address");
    if (!savedAddress || !JSON.parse(savedAddress)) {
      try {
        newAddress(apiUrl).then((newAddress) => {
          localStorage.setItem("address", JSON.stringify(newAddress));
          setAddress(newAddress);
        });
      } catch (error) {
        console.error(error);
      }
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
