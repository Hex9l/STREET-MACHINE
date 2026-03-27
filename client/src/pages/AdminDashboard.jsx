import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AssetEntryForm from '../components/admin/AssetEntryForm';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [assetTab, setAssetTab] = useState('all');
    const [categoryTab, setCategoryTab] = useState('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', brand: '', price: '', type: 'car', category: '', description: '',
        images: '', features: '', colors: ''
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchVehicles();
        fetchCategories();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles`);
            const data = await res.json();
            setVehicles(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!user || !user.token) {
            toast.error('Session expired. Please log in.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        const loadingToast = toast.loading('Deleting Asset...');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                toast.success('Asset Deleted Successfully', { id: loadingToast });
                fetchVehicles();
            } else {
                toast.error('Failed to Delete Asset', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Server Protocol Failure', { id: loadingToast });
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!user || !user.token) {
            toast.error('Session expired. Please log in.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        const loadingToast = toast.loading('Deleting Category...');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                toast.success('Category Deleted', { id: loadingToast });
                fetchCategories();
            } else {
                toast.error('Failed to Delete Category', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Server Protocol Failure', { id: loadingToast });
        }
    };

    const [editingVehicle, setEditingVehicle] = useState(null);

    const handleCreate = async (payload) => {
        if (!user || !user.token) {
            toast.error('Session expired. Please log in.');
            return;
        }
        const loadingToast = toast.loading(editingVehicle ? 'Updating Asset...' : 'Deploying Asset...');
        try {
            const url = editingVehicle
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles/${editingVehicle._id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles`;

            const method = editingVehicle ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: payload
            });

            // Safely parse response
            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error("Received non-JSON response:", text);
                data = { message: text || "Unknown Error Occurred" };
            }

            if (res.ok) {
                toast.success(editingVehicle ? 'Asset Re-calibrated Successfully' : 'Asset Deployed Successfully', { id: loadingToast });
                setShowForm(false);
                setEditingVehicle(null);
                fetchVehicles();
            } else {
                console.error('Failed to save vehicle:', data);
                toast.error(`Error: ${data.message || 'Failed to save vehicle'}`, { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Server Protocol Failure: ' + error.message, { id: loadingToast });
        }
    };

    const handleEdit = (vehicle) => {
        setEditingVehicle(vehicle);
        setShowForm(true);
        setTimeout(() => {
            document.getElementById('asset-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingVehicle(null);
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    // Category Form State
    const [showCatForm, setShowCatForm] = useState(false);
    const [catFormData, setCatFormData] = useState({
        name: '', description: '', type: 'car'
    });

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!user || !user.token) {
            toast.error('Session expired. Please log in.');
            return;
        }
        const loadingToast = toast.loading('Creating Category...');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(catFormData)
            });

            if (res.ok) {
                toast.success('Category Created Successfully', { id: loadingToast });
                setShowCatForm(false);
                setCatFormData({ name: '', description: '', type: 'car' });
                fetchCategories();
            } else {
                toast.error('Failed to Create Category', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Server Protocol Failure', { id: loadingToast });
            console.error(error);
        }
    };

    // ... (Render)

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    // Filter Logic
    const safeSearchTerm = (searchTerm || '').toLowerCase();

    const filteredVehicles = vehicles
        .filter(v => {
            if (assetTab !== 'all' && v.type !== assetTab) return false;
            return (
                (v.name || '').toLowerCase().includes(safeSearchTerm) ||
                (v.brand || '').toLowerCase().includes(safeSearchTerm) ||
                (v.type || '').toLowerCase().includes(safeSearchTerm)
            );
        })
        .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (a._id ? a._id.toString() : '');
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (b._id ? b._id.toString() : '');
            if (typeof dateA === 'number' && typeof dateB === 'number') return dateB - dateA;
            if (typeof dateA === 'string' && typeof dateB === 'string') return dateB.localeCompare(dateA);
            return 0;
        });

    const filteredCategories = categories
        .filter(c => {
            if (categoryTab !== 'all' && c.type !== categoryTab) return false;
            return (
                (c.name || '').toLowerCase().includes(safeSearchTerm) ||
                (c.type || '').toLowerCase().includes(safeSearchTerm) ||
                (c.description || '').toLowerCase().includes(safeSearchTerm)
            );
        })
        .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (a._id ? a._id.toString() : '');
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (b._id ? b._id.toString() : '');
            if (typeof dateA === 'number' && typeof dateB === 'number') return dateB - dateA;
            if (typeof dateA === 'string' && typeof dateB === 'string') return dateB.localeCompare(dateA);
            return 0;
        });

    // Reset pagination on search or tab change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, assetTab]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="min-h-screen bg-[#050505] pt-6 md:pt-12 px-3 sm:px-4 md:px-8 text-white overflow-x-hidden block">
            <div className="container mx-auto max-w-[1600px]">
                {/* ─── Top Navigation ─── */}
                <motion.div variants={fadeInUp} className="mb-6 md:mb-10">
                    <Link to="/" className="inline-flex items-center group">
                        <div className="w-9 h-9 md:w-14 md:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center group-hover:border-[#ef4444] group-hover:bg-[#ef4444] text-white transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <ArrowLeft className="w-4 h-4 md:w-7 md:h-7 group-hover:-translate-x-1.5 transition-transform duration-300" />
                        </div>
                    </Link>
                </motion.div>

                {/* ─── Header Row ─── */}
                <motion.div variants={fadeInUp} className="mb-8 md:mb-16 border-b border-white/5 pb-6 md:pb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
                        {/* Title Section */}
                        <div className="shrink-0 text-center lg:text-left">
                            <span className="text-[#ef4444] uppercase tracking-[0.4em] text-[10px] sm:text-xs font-black mb-2 block">System Control</span>
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-black italic uppercase text-white tracking-tighter leading-none">Command <span className="text-[#ef4444]">Center</span></h1>
                        </div>

                        {/* Controls Section: Search + Buttons */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full lg:max-w-4xl">
                            {/* Search bar */}
                            <div className="relative flex-grow group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-[#ef4444] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="SEARCH DATABASES..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white pl-12 pr-4 py-4 rounded-[2px] focus:outline-none focus:border-[#ef4444] focus:bg-[#111] transition-all duration-300 text-xs font-black uppercase tracking-[0.1em] placeholder:text-gray-700 shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:flex gap-3 shrink-0">
                                <Button 
                                    variant="secondary" 
                                    onClick={() => setShowCatForm(!showCatForm)} 
                                    className="px-4 md:px-8 py-4 text-[10px] font-black tracking-widest border-white/10 hover:border-[#ef4444]/50 flex items-center justify-center gap-2"
                                >
                                    {showCatForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    <span>{showCatForm ? 'CANCEL' : 'CATEGORY'}</span>
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={() => { if (showForm) handleCloseForm(); else setShowForm(true); }} 
                                    className="px-4 md:px-8 py-4 text-[10px] font-black tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                                >
                                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    <span>{showForm ? 'CANCEL' : 'ASSET'}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Category Form */}
                <AnimatePresence>
                    {showCatForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="mb-10 bg-[#0a0a0a] border border-white/5 p-4 sm:p-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent opacity-50" />
                            <h2 className="text-xl sm:text-3xl font-display font-black italic text-white uppercase tracking-tighter mb-5 sm:mb-8">
                                New Category <span className="text-[#ef4444]">Entry</span>
                            </h2>
                            <form onSubmit={handleCreateCategory} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-1">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Category Name</label>
                                    <input
                                        className="w-full bg-[#111] border border-white/20 rounded-[2px] p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] hover:bg-white/10 transition-all duration-200 text-xs font-bold uppercase shadow-inner"
                                        value={catFormData.name}
                                        onChange={e => setCatFormData({ ...catFormData, name: e.target.value })}
                                        placeholder="e.g. Hypercar"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Type</label>
                                    <div className="relative">
                                        <select
                                            value={catFormData.type}
                                            onChange={e => setCatFormData({ ...catFormData, type: e.target.value })}
                                            className="w-full bg-[#111] border border-white/20 rounded-[2px] p-3 text-white focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] hover:bg-white/10 transition-all duration-200 text-xs tracking-widest font-bold uppercase appearance-none shadow-inner"
                                        >
                                            <option value="car">Car</option>
                                            <option value="bike">Bike</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Description</label>
                                    <textarea
                                        value={catFormData.description}
                                        onChange={e => setCatFormData({ ...catFormData, description: e.target.value })}
                                        className="w-full bg-[#111] border border-white/20 rounded-[2px] p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] hover:bg-white/10 transition-all duration-200 text-xs font-bold shadow-inner"
                                        rows="3"
                                        placeholder="Brief description of this category..."
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <Button type="submit" variant="primary" className="px-8">
                                        Create Category
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Vehicle Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            id="asset-form-section"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="mb-16 mt-8 block"
                        >
                            <AssetEntryForm
                                categories={categories}
                                initialData={editingVehicle}
                                onSubmit={handleCreate}
                                onCancel={handleCloseForm}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div variants={fadeInUp} className="bg-[#0a0a0a] border border-white/5 rounded-none overflow-hidden mb-16">
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-6 border-b border-white/5 gap-4">
                        <h3 className="text-[#ef4444] font-display font-bold italic uppercase text-xl md:text-2xl">Asset Database</h3>
                        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                            {['all', 'car', 'bike'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setAssetTab(tab)}
                                    className={`px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${assetTab === tab ? 'bg-[#ef4444] text-white border border-[#ef4444]' : 'bg-[#111] text-gray-500 border border-white/10 hover:border-white/20 hover:text-white'}`}
                                >
                                    {tab === 'all' ? 'All Assets' : tab + 's'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 md:p-8">
                        {/* Mobile Check List Layout (Database Style) */}
                        <div className="lg:hidden">
                            {/* Mobile Column Headers */}
                            <div className="px-5 py-2 border-b border-white/10 flex justify-between items-center bg-[#050505]">
                                <span className="text-[#ef4444] text-[8px] font-black uppercase tracking-widest">Name</span>
                            </div>
                            
                            <div className="divide-y divide-white/5">
                                {loading ? (
                                    Array.from({ length: 10 }).map((_, idx) => (
                                        <div key={`mob-skeleton-${idx}`} className="p-5 animate-pulse flex justify-between items-center bg-[#050505]">
                                            <div className="space-y-2 w-2/3">
                                                <div className="h-5 bg-white/10 w-full rounded"></div>
                                                <div className="h-3 bg-white/5 w-1/3 rounded"></div>
                                            </div>
                                            <div className="h-4 bg-[#ef4444]/10 w-16 rounded"></div>
                                        </div>
                                    ))
                                ) : currentVehicles.length > 0 ? (
                                    currentVehicles.map(v => (
                                        <div key={v._id} className="bg-[#050505] p-5 group flex flex-col gap-1 transition-all hover:bg-white/[0.02]">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <h4 className="text-lg font-display font-black italic uppercase text-white group-hover:text-[#ef4444] transition-colors truncate">
                                                        {v.name}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-gray-600 text-[9px] uppercase font-black tracking-widest">{v.brand}</span>
                                                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest ${v.type === 'car' ? 'text-blue-500/80' : 'text-green-500/80'}`}>
                                                            {v.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-[#ef4444] font-display font-black text-lg italic whitespace-nowrap">
                                                    ₹{v.price ? Number(v.price).toLocaleString('en-IN') : 'N/A'}
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-6 mt-4 pt-4 border-t border-white/[0.03]">
                                                <button onClick={() => handleEdit(v)} className="text-gray-500 hover:text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-white/30 transition-colors"></div>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(v._id)} className="text-red-900 hover:text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-900/40 group-hover:bg-red-500/40 transition-colors"></div>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-600 uppercase font-black text-[10px] tracking-widest">No assets in database.</div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#050505] text-gray-500 uppercase text-[10px] tracking-widest border-b border-white/5">
                                    <tr>
                                        <th className="p-6 font-black text-[#ef4444] opacity-80">Designation</th>
                                        <th className="p-6 font-black text-[#ef4444] opacity-80">Marque</th>
                                        <th className="p-6 font-black text-[#ef4444] opacity-80">Valuation</th>
                                        <th className="p-6 font-black text-[#ef4444] opacity-80">Classification</th>
                                        <th className="p-6 font-black text-[#ef4444] opacity-80 text-right">Directives</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        Array.from({ length: 8 }).map((_, idx) => (
                                            <tr key={`skeleton-${idx}`} className="animate-pulse">
                                                <td className="p-6"><div className="h-6 bg-white/10 rounded w-48"></div></td>
                                                <td className="p-6"><div className="h-4 bg-white/5 rounded w-24"></div></td>
                                                <td className="p-6"><div className="h-6 bg-white/10 rounded w-32"></div></td>
                                                <td className="p-6"><div className="h-6 bg-white/5 rounded w-16"></div></td>
                                                <td className="p-6"><div className="h-4 bg-white/10 rounded w-24 ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : currentVehicles.map(v => (
                                        <tr key={v._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6">
                                                <div className="font-display font-black italic text-white text-xl uppercase group-hover:text-[#ef4444] transition-colors">{v.name}</div>
                                            </td>
                                            <td className="p-6 text-gray-500 text-[10px] uppercase tracking-widest font-black">{v.brand}</td>
                                            <td className="p-6 text-white font-display font-black text-xl italic">₹{v.price ? Number(v.price).toLocaleString('en-IN') : 'N/A'}</td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${v.type === 'car' ? 'border-blue-500/20 text-blue-400' : 'border-green-500/20 text-green-400'}`}>
                                                    {v.type}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right space-x-6">
                                                <button onClick={() => handleEdit(v)} className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">EDIT</button>
                                                <button onClick={() => handleDelete(v._id)} className="text-[#ef4444] hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">DELETE</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Table Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-8 py-6 border-t border-white/5 gap-6">
                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredVehicles.length)} of {filteredVehicles.length} assets
                            </span>
                            
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 border rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                                        currentPage === 1 
                                        ? 'border-white/5 opacity-40 cursor-not-allowed text-gray-600' 
                                        : 'border-white/10 text-gray-400 hover:border-[#ef4444]/50 hover:text-white hover:bg-[#ef4444]/5'
                                    }`}
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                </button>
                                
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[#ef4444] font-display italic font-black text-lg leading-none">{currentPage}</span>
                                    <span className="text-gray-600 font-bold text-[10px]">/</span>
                                    <span className="text-gray-400 font-display italic font-black text-base leading-none">{totalPages}</span>
                                </div>

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 border rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                                        currentPage === totalPages 
                                        ? 'border-white/5 opacity-40 cursor-not-allowed text-gray-600' 
                                        : 'border-white/10 text-gray-400 hover:border-[#ef4444]/50 hover:text-white hover:bg-[#ef4444]/5'
                                    }`}
                                >
                                    <ArrowLeft className="w-3 h-3 rotate-180" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                <motion.div variants={fadeInUp} className="bg-[#0a0a0a] border border-white/5 rounded-none overflow-hidden mb-8 md:mb-16">
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-6 border-b border-white/5 gap-4">
                        <h3 className="text-[#ef4444] font-display font-bold italic uppercase text-xl md:text-2xl">Classification Database</h3>
                        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                            {['all', 'car', 'bike'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setCategoryTab(tab)}
                                    className={`px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${categoryTab === tab ? 'bg-[#ef4444] text-white border border-[#ef4444]' : 'bg-[#111] text-gray-500 border border-white/10 hover:border-white/20 hover:text-white'}`}
                                >
                                    {tab === 'all' ? 'All Classes' : tab + 's'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 md:p-8">
                        {/* Mobile Check List Layout (Database Style) */}
                        <div className="lg:hidden">
                            {/* Mobile Column Headers */}
                            <div className="px-5 py-2 border-b border-white/10 flex justify-between items-center bg-[#050505]">
                                <span className="text-[#ef4444] text-[8px] font-black uppercase tracking-widest">Codename</span>
                            </div>

                            <div className="divide-y divide-white/5">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <div key={`cat-mob-skeleton-${idx}`} className="p-5 animate-pulse flex justify-between items-center bg-[#050505]">
                                            <div className="space-y-2 w-2/3">
                                                <div className="h-5 bg-white/10 w-full rounded"></div>
                                                <div className="h-3 bg-white/5 w-1/2 rounded"></div>
                                            </div>
                                            <div className="h-4 bg-[#ef4444]/10 w-16 rounded"></div>
                                        </div>
                                    ))
                                ) : filteredCategories.length > 0 ? (
                                    filteredCategories.map(c => (
                                        <div key={c._id} className="bg-[#050505] p-5 group flex flex-col gap-1 transition-all hover:bg-white/[0.02]">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <h4 className="text-lg font-display font-black italic uppercase text-white group-hover:text-[#ef4444] transition-colors truncate">
                                                        {c.name}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className={`text-[8px] font-black uppercase tracking-widest ${c.type === 'car' ? 'text-blue-500/80' : 'text-green-500/80'}`}>
                                                            {c.type}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                                        <span className="text-gray-600 text-[9px] uppercase font-black tracking-widest">Classification</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleDeleteCategory(c._id)} className="text-red-900 hover:text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-900/40 group-hover:bg-red-500/40 transition-colors"></div>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-[10px] uppercase font-black leading-relaxed mt-2 line-clamp-2 opacity-60">
                                                {c.description}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-600 uppercase font-black text-[10px] tracking-widest">No classifications in database.</div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#050505] text-gray-500 uppercase text-[10px] tracking-widest border-b border-white/5">
                                    <tr>
                                        <th className="p-6 font-black text-[#ef4444] opacity-80">Codename</th>
                                        <th className="p-6 font-black text-[#ef4444] opacity-80">Unit Type</th>
                                        <th className="p-6 font-black text-[#ef4444] opacity-80">Operational Parameters</th>
                                        <th className="p-6 font-black text-[#ef4444] opacity-80 text-right">Protocols</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <tr key={`cat-skeleton-${idx}`} className="animate-pulse">
                                                <td className="p-6"><div className="h-6 bg-white/10 rounded w-48"></div></td>
                                                <td className="p-6"><div className="h-6 bg-white/5 rounded w-16"></div></td>
                                                <td className="p-6"><div className="h-4 bg-white/5 rounded w-72"></div></td>
                                                <td className="p-6 text-right"><div className="h-4 bg-[#ef4444]/20 rounded w-16 ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : filteredCategories.map(c => (
                                        <tr key={c._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6 font-display font-black italic text-white text-xl uppercase group-hover:text-[#ef4444] transition-colors">{c.name}</td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${c.type === 'car' ? 'border-blue-500/20 text-blue-400' : 'border-green-500/20 text-green-400'}`}>
                                                    {c.type}
                                                </span>
                                            </td>
                                            <td className="p-6 text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-sm truncate">{c.description}</td>
                                            <td className="p-6 text-right">
                                                <button onClick={() => handleDeleteCategory(c._id)} className="text-[#ef4444] hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">DELETE</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
