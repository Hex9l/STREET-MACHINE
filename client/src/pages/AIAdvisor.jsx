import { API_URL } from '../api.js';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import VehicleCard from '../components/VehicleCard';
import Skeleton from '../components/ui/Skeleton';

const AIAdvisor = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch(`${API_URL}/api/ai/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-32 px-8 text-white relative overflow-hidden">
            {/* Background FX */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[#ef4444]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[#ef4444] uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Artificial Intelligence</span>
                    <h1 className="text-5xl md:text-6xl font-display font-black italic mb-6 text-white uppercase">
                        Neural Advisor
                    </h1>
                    <p className="text-gray-500 text-sm uppercase tracking-widest max-w-lg mx-auto leading-relaxed font-bold">
                        Powered by advanced algorithms. Describe your requirements, and the system will curate the perfect machine for your collection.
                    </p>
                    <div className="w-24 h-[2px] bg-[#ef4444] mx-auto mt-8"></div>
                </div>

                <form onSubmit={handleSearch} className="mb-20 relative max-w-2xl mx-auto">
                    <div className="flex gap-4">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., 'I need a grand tourer under $200k' or 'Track focused superbike'"
                            className="bg-[#0a0a0a] border-white/10 text-lg py-5 px-8 rounded-none focus:border-[#ef4444] placeholder:text-gray-700 font-bold"
                        />
                        <Button type="submit" variant="primary" className="rounded-none px-10" disabled={loading}>
                            {loading ? 'Analyzing...' : 'Analyze'}
                        </Button>
                    </div>
                </form>

                {loading && (
                    <div className="text-center py-12">
                        <Skeleton className="w-16 h-1 w-32 mx-auto mb-6" variant="card" />
                        <p className="text-[#ef4444] animate-pulse uppercase tracking-[0.3em] text-[10px] font-bold">Processing Neural Request...</p>
                    </div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-16"
                    >
                        <div className="p-10 bg-[#0a0a0a] border border-white/5 relative group">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent opacity-50"></div>
                             <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#ef4444]"></div>
                             <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#ef4444]"></div>
                            
                            <h3 className="text-[#ef4444] font-bold uppercase tracking-[0.3em] mb-6 text-[10px] text-center">System Analysis</h3>
                            <p className="text-xl text-gray-300 leading-relaxed font-display font-bold italic text-center">"{result.reasoning}"</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                                <span className="text-white font-display font-bold italic text-2xl uppercase">Recommended Assets</span>
                                <span className="text-[#ef4444] text-xs uppercase tracking-widest font-bold">{result.recommendations.length} Matches Found</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {result.recommendations.map((vehicle) => (
                                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIAdvisor;
