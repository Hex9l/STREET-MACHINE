import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://placehold.co/1920x1080/050505/ef4444?text=Login+Background')] bg-cover bg-center opacity-20 blur-sm brightness-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md p-10 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/5 shadow-2xl skew-x-[-1deg]"
            >
                <div className="text-center mb-10 transform skew-x-[1deg]">
                    <span className="text-[#ef4444] uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Welcome Back</span>
                    <h2 className="text-4xl font-display font-black italic text-white uppercase">
                        Pilot Access
                    </h2>
                    <div className="w-12 h-[2px] bg-[#ef4444] mx-auto mt-6"></div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 text-red-200 text-xs tracking-wide uppercase text-center transform skew-x-[1deg]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 transform skew-x-[1deg]">
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-[#ef4444] font-bold ml-1">Email Coordinates</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="pilot@streetmachine.com"
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ef4444] transition-colors font-bold"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-[#ef4444] font-bold ml-1">Password Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ef4444] transition-colors font-bold"
                        />
                    </div>

                    <Button type="submit" variant="primary" className="w-full mt-8">
                        Enter System
                    </Button>
                </form>

                <p className="mt-10 text-center text-gray-500 text-xs uppercase tracking-widest transform skew-x-[1deg] font-bold">
                    New Identity?{' '}
                    <Link to="/signup" className="text-[#ef4444] hover:text-white transition-colors border-b border-[#ef4444] pb-0.5 ml-2">
                        Register
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
