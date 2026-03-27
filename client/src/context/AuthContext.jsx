import { API_URL } from '../api.js';
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('streetmachine_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('streetmachine_user', JSON.stringify(data));
                setUser(data);
                navigate('/');
                toast.success(`Welcome back, ${data.username}!`);
                return { success: true };
            } else {
                toast.error(data.message || 'Login failed');
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error('Server error. Please try again.');
            return { success: false, message: 'Server error' };
        }
    };

    const signup = async (username, email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('streetmachine_user', JSON.stringify(data));
                setUser(data);
                navigate('/');
                toast.success('Account created successfully!');
                return { success: true };
            } else {
                toast.error(data.message || 'Signup failed');
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error('Server error. Please try again.');
            return { success: false, message: 'Server error' };
        }
    };

    const logout = () => {
        localStorage.removeItem('streetmachine_user');
        setUser(null);
        navigate('/login');
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
