import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { Header } from './assets/home/component/Header';
import { Footer } from "./assets/home/component/Footer";
import Home from "./assets/home/Home";
import Favorite from "./assets/home/Favorite";
import MealDetail from "./assets/home/component/MealDetail";


function App() {
  return (
    // <Router>
    <div>
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/favorites' element={<Favorite />} />
        <Route path='/meal/:id' element={<MealDetail />} />
      </Routes>

      <Footer />
    </div>
    // </Router>
  );
}

export default App;
