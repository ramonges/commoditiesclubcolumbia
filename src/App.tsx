import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import News from './pages/News';
import Research from './pages/Research';
import Events from './pages/Events';
import Admin from './pages/Admin';
import ArticleDetail from './pages/ArticleDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/research" element={<Research />} />
            <Route path="/strategies" element={<Research />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
