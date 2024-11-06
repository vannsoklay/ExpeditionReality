import React from "react";
import './styles/styles.css';
import { createRoot } from 'react-dom/client';
import App from "./App";

const rootElement = document.getElementById('root');

// Ensure the root element exists before rendering
if (rootElement) {
    // Create a root and render the App component
    const root = createRoot(rootElement);
    root.render(<React.StrictMode>
        <App/>
    </React.StrictMode>);
}