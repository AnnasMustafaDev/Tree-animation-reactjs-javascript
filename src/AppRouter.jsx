import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BirthdayExperience from './App';
import AdminPage from './AdminPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BirthdayExperience />} />
        <Route path="/1470/admin" element={<AdminPage />} />
        <Route path="/:code/:name" element={<BirthdayExperience />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
