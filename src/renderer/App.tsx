import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Catalogue from '../views/Catalogue/Catalogue';
import { QueryClient, QueryClientProvider } from 'react-query';
import GameDetail from '../views/GameDetail/GameDetail';
import Download from '../views/Download/Download';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/download" element={<Download />} />
          <Route path="/gameDetail" element={<GameDetail />} />
          <Route path="/" element={<Catalogue />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
