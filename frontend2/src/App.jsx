import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alunos from "./pages/Alunos";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alunos" element={<Alunos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
