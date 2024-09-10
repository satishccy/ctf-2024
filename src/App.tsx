import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Challenge1Page } from './components/Challenge1/Challenge1.page';
import { Challenge2Page } from './components/Challenge2/Challenge2.page';

function App() {
  return (
    <Router basename='ctf-2024/dist/'>
        <nav>
            <ul>
                <li><Link to="/challenge-1">Challenge 1</Link></li>
                <li><Link to="/challenge-2">Challenge 2</Link></li>
            </ul>
        </nav>
        <main>
            <Routes>
                <Route path="/challenge-1" element={<Challenge1Page />} />
                <Route path="/challenge-2" element={<Challenge2Page />} />
            </Routes>
        </main>
    </Router>
);
}

export default App;
