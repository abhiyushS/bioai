import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import ProteinViewerPage from './pages/ProteinViewerPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/protein-viewer/:proteinId" element={<ProteinViewerPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;