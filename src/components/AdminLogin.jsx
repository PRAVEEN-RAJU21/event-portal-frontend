import React, { useState } from 'react';

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                onLoginSuccess(); 
            } else {
                setError('ACCESS DENIED: Invalid Username or Password.');
            }
        } catch (err) {
            // FIXED: We are now actively logging the 'err' variable so ESLint is happy!
            console.error("Login attempt failed:", err); 
            setError('Server connection failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '100px auto', animation: 'fadeInUp 0.5s ease' }}>
            <h2 style={{ textAlign: 'center', color: '#00f6ff', marginBottom: '10px' }}>RESTRICTED AREA</h2>
            <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '30px' }}>Please enter admin credentials.</p>

            {error && (
                <div style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid red', padding: '10px', borderRadius: '8px', color: '#ff4444', textAlign: 'center', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>USERNAME</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        autoFocus
                    />
                </div>
                <div className="form-group">
                    <label>PASSWORD</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                    <button type="button" onClick={onCancel} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        CANCEL
                    </button>
                    <button type="submit" style={{ flex: 2, background: '#00f6ff', color: '#000', fontWeight: 'bold', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {loading ? 'VERIFYING...' : 'LOGIN'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;