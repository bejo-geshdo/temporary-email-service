//import "./App.css";
import { EmailClient } from "./containers/EmailClient";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <EmailClient />
    </>
  );
}

export default App;
