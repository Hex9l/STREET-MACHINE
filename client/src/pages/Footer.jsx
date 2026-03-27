import React, { useState } from 'react';
import Hero from '../components/Hero';
import EngineLayouts from '../components/EngineLayouts';
import Button from '../components/ui/Button';
import { MapPin, Phone, ExternalLink, User, Mail, MessageSquare } from 'lucide-react';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    setSuccess('Message sent successfully!');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSuccess(''), 5000);
  } catch (err) {
    setError(err.message);
    setTimeout(() => setError(''), 5000);
  } finally {
    setLoading(false);
  }
};

return (
  <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
    <Hero />
    <EngineLayouts />

    {/* FOOTER PREVIEW (Contact Info from visual) */}
    <footer className="bg-black py-12 md:py-20 border-t border-white/10">
      <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
        <div>
          <h3 className="text-xl font-display font-bold uppercase text-white mb-8">Contact Info</h3>
          <div className="space-y-6 text-gray-500 text-sm font-medium tracking-wide">

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 border border-white/10 rounded-full text-[#ef4444]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-white uppercase font-bold text-xs tracking-widest mb-1">Address</p>
                <p>Nikol<br />Ahmedabad, Gujarat, India</p>
                <a href="https://maps.app.goo.gl/qJhFL22voqsoikiA7" target="_blank" rel="noopener noreferrer" className="text-[#ef4444] cursor-pointer hover:underline flex items-center gap-2 mt-2 text-xs uppercase font-bold">
                  View On Google Map <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 border border-white/10 rounded-full text-[#ef4444]">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-white uppercase font-bold text-xs tracking-widest mb-1">Phone</p>
                <p>+91 8200800569</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-display font-bold uppercase text-white mb-8">Contact Us</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded text-sm uppercase font-bold text-center">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded text-sm uppercase font-bold text-center">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative group">
                <User className="absolute left-0 top-2.5 text-gray-600 group-focus-within:text-[#ef4444] transition-colors" size={18} />
                <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="NAME" className="w-full bg-transparent border-b border-gray-800 py-2 pl-8 text-white outline-none focus:border-[#ef4444] transition-colors text-sm uppercase placeholder:text-gray-700 font-bold" />
              </div>
              <div className="relative group">
                <Mail className="absolute left-0 top-2.5 text-gray-600 group-focus-within:text-[#ef4444] transition-colors" size={18} />
                <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="EMAIL" className="w-full bg-transparent border-b border-gray-800 py-2 pl-8 text-white outline-none focus:border-[#ef4444] transition-colors text-sm uppercase placeholder:text-gray-700 font-bold" />
              </div>
            </div>
            <div className="relative group">
              <Phone className="absolute left-0 top-2.5 text-gray-600 group-focus-within:text-[#ef4444] transition-colors" size={18} />
              <input name="phone" value={formData.phone} onChange={handleChange} type="text" placeholder="PHONE" className="w-full bg-transparent border-b border-gray-800 py-2 pl-8 text-white outline-none focus:border-[#ef4444] transition-colors text-sm uppercase placeholder:text-gray-700 font-bold" />
            </div>
            <div className="relative group">
              <MessageSquare className="absolute left-0 top-2.5 text-gray-600 group-focus-within:text-[#ef4444] transition-colors" size={18} />
              <textarea required name="message" value={formData.message} onChange={handleChange} placeholder="MESSAGE" rows="3" className="w-full bg-transparent border-b border-gray-800 py-2 pl-8 text-white outline-none focus:border-[#ef4444] transition-colors text-sm uppercase placeholder:text-gray-700 font-bold resize-none"></textarea>
            </div>
            <Button disabled={loading} type="submit" variant="primary" className="w-full">
              {loading ? 'SENDING...' : 'SEND MESSAGE'}
            </Button>
          </form>
        </div>
      </div>
    </footer>
  </div>
);
};

export default Footer;
