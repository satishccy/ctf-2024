import { HashRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { Challenge1Page } from "./components/Challenge1/Challenge1.page";
import { Challenge2Page } from "./components/Challenge2/Challenge2.page";
import { Challenge3Page } from "./components/Challenge3/Challenge3.page";
import { Challenge4Page } from "./components/Challenge4/Challenge4.page";
import algorandLogo from "./assets/algorand_logo_mark_black.svg";

function App() {
  return (
    <Router>
      <div className="bg">
          <img src={algorandLogo} alt="Algorand Logo" />
          <h1>Algobharat CTF 2024</h1>
        </div>
      <nav>
        <div>
          <NavLink to="/challenge-1">Challenge 1</NavLink>
        </div>
        <div>
          <NavLink to="/challenge-2">Challenge 2</NavLink>
        </div>
        <div>
          <NavLink to="/challenge-3">Challenge 3</NavLink>
        </div>
        <div>
          <NavLink to="/challenge-4">Challenge 4</NavLink>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/challenge-1" element={<Challenge1Page />} />
          <Route path="/challenge-2" element={<Challenge2Page />} />
          <Route path="/challenge-3" element={<Challenge3Page />} />
          <Route path="/challenge-4" element={<Challenge4Page />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
