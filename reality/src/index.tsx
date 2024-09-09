import React from 'react';
import App from './App';
import './styles/styles.scss';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');

// Ensure the root element exists before rendering
if (rootElement) {
    // Create a root and render the App component
    const root = createRoot(rootElement);
    root.render(<App />);
}