import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { Header } from './assets/home/Header';
import Landingpage from './assets/home/Landingpage';
import Home from './assets/home/Home';
import Favorite from './assets/home/Favorite';
import MealDetail from './assets/home/MealDetail';

function App() {
  return (
    // <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/favorites' element={<Favorite />} />
      <Route path='/meal/:id' element={<MealDetail />} />
    </Routes>
    // </Router>
  );
}

export default App;
