import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ChapterPage from './pages/ChapterPage';
import SimulationPage from './pages/SimulationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<div className="p-8 text-center text-gray-500">Selecione um capítulo</div>} />
          <Route path="chapter/:id" element={<ChapterPage />} />
          <Route path="questoes" element={<SimulationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
