import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./Home"
import About from "./About"
import Contact from "./Contact"
//import Layout from "./components/Layout";

function App() {
 return (
   <div className="App">
     <BrowserRouter>
       <Routes>
         <Route >
           <Route path="/" element={<Home />} />
           <Route path="about" element={<About />} />
           <Route path="contact" element={<Contact />} />
         </Route>
       </Routes>
     </BrowserRouter>
   </div>
 )
}

export default App