import { useNavigate } from 'react-router-dom'

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#1e1e1e', color: 'white' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to Your Dashboard</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px', maxWidth: '600px', textAlign: 'center' }}>
                This is the landing page. You can add some marketing content here, or just redirect to the login page. For now, let's just have a button that takes us to the dashboard.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    style={{ padding: '12px 24px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                >
                    Go to Dashboard
                </button>
                <button 
                    onClick={() => navigate('/login')} 
                    style={{ padding: '12px 24px', backgroundColor: '#333', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                >
                    Login
                </button>
                <button 
                    onClick={() => navigate('/projects')} 
                    style={{ padding: '12px 24px', backgroundColor: '#333', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                >
                    View Projects
                </button>
            </div>
        </div>
    )
}