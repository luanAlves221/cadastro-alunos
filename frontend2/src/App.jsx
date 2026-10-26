import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alunos from "./pages/Alunos";
import Professores from "./pages/Professores";
import Funcionarios from "./pages/Funcionarios";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
