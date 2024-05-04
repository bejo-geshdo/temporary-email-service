//import "./App.css";
import { EmailClient } from "./containers/EmailClient";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import AddressContextProvider from "./contexts/address-context";
import EmailsContextProvider from "./contexts/emails-context";

function App() {
  return (
    <>
      <AddressContextProvider>
        <EmailsContextProvider>
          <Navbar />
          <Hero />
          <EmailClient />
        </EmailsContextProvider>
      </AddressContextProvider>
    </>
  );
}

export default App;
