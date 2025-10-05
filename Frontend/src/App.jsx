import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UniversityDashboard from './pages/UniversityDashboard';
import ManageAlumni from './pages/ManageAlumni'; // We will create this next
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UniversityDashboard />} />
        <Route path="/manage-alumni" element={<ManageAlumni />} />
      </Routes>
    </Router>
  );
}

export default App;