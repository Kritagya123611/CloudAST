import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#1e1e1e', color: 'white' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to Your Dashboard</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px', maxWidth: '600px', textAlign: 'center' }}>
                This is where you'll manage your cloud infrastructure blueprints, view analytics, and access your projects. 
                Use the navigation menu to explore different sections of the app.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
                <button
                    onClick={() => navigate('/studio')}
                >
                    Go to Studio
                </button>
                <button
                    onClick={() => navigate('/projects')}
                >
                    View Projects
                </button>
            </div>
        </div>
    )
}