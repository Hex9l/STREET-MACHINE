import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Input from './ui/Input';
import toast from 'react-hot-toast';

const ReviewSection = ({ vehicleId }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${vehicleId}`);
                const data = await res.json();
                setReviews(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReviews();
    }, [vehicleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !comment) return;
        setLoading(true);
        try {
            if (!user || !user.token) {
                toast.error('Session expired. Please log in.');
                return;
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ rating, comment, vehicleId }),
            });
            if (res.ok) {
                const newReview = await res.json();
                window.location.reload();
            } else {
                alert('Failed to submit review');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-24 border-t border-white/5 pt-16">
            <div className="flex flex-col items-center mb-16">
                 <span className="text-[#fbbf24] uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Pilot Feedback</span>
                 <h2 className="text-4xl font-serif-display font-medium text-white">Client Reports</h2>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {reviews.length === 0 ? (
                    <div className="col-span-2 text-center py-12 border border-white/5 bg-[#0a0a0a]">
                        <p className="text-gray-500 uppercase tracking-widest text-xs">No intelligence reports filed yet.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-[#0a0a0a] p-8 border border-white/5 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.00012 13.1784 11.3501 11.4151 12.5539 10.9388C13.2536 10.662 13.916 10.3662 14.3982 9.8839C15.0163 9.26577 15.3934 8.70774 15.6599 8.24357L15.6601 8.24318C16.8049 6.24159 15.7001 2 13.0001 2C10.6865 2 7.68412 3.86435 6.42586 6.94271C5.65742 8.82269 5.01524 12.2882 5.0001 16.5C5.0001 18.9853 7.01482 21 9.5001 21H14.017ZM21.017 21L21.017 18C21.017 16.8954 20.1216 16 19.017 16H16C16.0001 13.1784 18.3501 11.4151 19.5539 10.9388C20.2536 10.662 20.916 10.3662 21.3982 9.8839C22.0163 9.26577 22.3934 8.70774 22.6599 8.24357L22.6601 8.24318C23.8049 6.24159 22.7001 2 20.0001 2C17.6865 2 14.6841 3.86435 13.4259 6.94271C12.6574 8.82269 12.0152 12.2882 12.0001 16.5C12.0001 18.9853 14.0148 21 16.5001 21H21.017Z" /></svg>
                            </div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-white font-serif-display text-lg block">{review.user?.username || 'Pilot'}</span>
                                    <span className="text-[#fbbf24] text-[10px] uppercase tracking-widest block mt-1">Verified Owner</span>
                                </div>
                                <div className="flex gap-1 text-[#fbbf24]">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < review.rating ? "opacity-100" : "opacity-20 text-gray-500"}>★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed italic border-l-2 border-[#fbbf24] pl-4">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-10 border border-white/5 max-w-3xl mx-auto">
                    <h3 className="text-xl font-serif-display text-white mb-8 border-b border-white/5 pb-4">Submit Intelligence Report</h3>
                    <div className="mb-8">
                        <label className="block text-[#fbbf24] text-[10px] font-bold uppercase tracking-widest mb-4">Rating Assessment</label>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl transition-all hover:scale-110 ${rating >= star ? 'text-[#fbbf24]' : 'text-gray-800'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-8">
                        <label className="block text-[#fbbf24] text-[10px] font-bold uppercase tracking-widest mb-4">Tactical Observation</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-none p-4 text-white placeholder-gray-700 focus:outline-none focus:border-[#fbbf24] transition-colors"
                            rows="5"
                            required
                            placeholder="Enter detailed analysis of vehicle performance..."
                        />
                    </div>
                    <Button type="submit" variant="primary" disabled={loading} className="w-full py-4 rounded-none">
                        {loading ? 'Transmitting...' : 'Submit Report'}
                    </Button>
                </form>
            ) : (
                <div className="p-12 bg-[#0a0a0a] border border-white/5 text-center max-w-2xl mx-auto">
                    <p className="text-gray-500 uppercase tracking-widest text-xs mb-6">Restricted Access. Authentication Required.</p>
                    <Button variant="secondary" onClick={() => window.location.href = '/login'} className="px-8 py-3 rounded-none text-xs">Initialize Login</Button>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
