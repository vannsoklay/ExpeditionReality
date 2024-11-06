import React from 'react';
import Scene from '@components/3d/Scene';
import { BrowserRouter as Router, Route, Routes, createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from '@components/ui/LandingPage';

const router = createBrowserRouter([
  {
      path: "/",
      element: <LandingPage />,
  },
  {
    path: "/playground",
    element: <Scene />,
},
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;