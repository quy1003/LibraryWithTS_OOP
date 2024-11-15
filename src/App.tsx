
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
// import Book from './Book';
import Category from './Category';
import Author from './Author';
import BookComponent from './Book';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/books" element={<BookComponent />} />
        <Route path="/authors" element={<Author/>} />
      </Routes>
    </Router>
  );
}

export default App
