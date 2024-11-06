import React from 'react';
import { useNavigate } from 'react-router-dom';
import "@styles/styles.css"

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to the 3D Playground</h1>
            <p className="text-lg mb-6">Click below to enter an interactive 3D scene.</p>
            <button
                onClick={() => navigate('/playground')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
                Enter Playground
            </button>
        </div>
    );
}

export default LandingPage;