import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus, Trash2, Car, Bike, Save, AlertCircle, Zap } from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-4 mb-8 pb-3 border-b border-white/5 relative">
        <div className="absolute bottom-0 left-0 w-24 h-[1px] bg-accent shadow-[0_0_10px_#ef4444]" />
        <div className="p-2 rounded-sm bg-accent/5 border border-accent/20 group-hover:border-accent/40 transition-colors">
            {Icon && <Icon className="w-5 h-5 text-accent" />}
        </div>
        <h3 className="text-xl font-display font-black uppercase italic text-white tracking-widest">
            {title}
        </h3>
    </div>
);

const InputGroup = ({ label, children, error }) => (
    <div className="flex flex-col gap-2.5 group/input">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-focus-within/input:text-accent transition-colors">
            {label}
        </label>
        {children}
        {error && <span className="text-red-500 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 mt-1"><AlertCircle size={10} /> {error}</span>}
    </div>
);

const StyledInput = ({ className, ...props }) => (
    <input
        className={`bg-[#0c0c0c] border border-white/10 rounded-[2px] p-4 text-white placeholder-gray-700 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 hover:bg-white/[0.02] hover:border-white/20 transition-all duration-300 font-bold uppercase text-[13px] w-full shadow-2xl tracking-widest ${className}`}
        {...props}
    />
);

const StyledSelect = ({ className, children, ...props }) => (
    <select
        className={`bg-[#0c0c0c] border border-white/10 rounded-[2px] p-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 hover:bg-white/[0.02] hover:border-white/20 transition-all duration-300 font-bold uppercase text-[13px] w-full shadow-2xl tracking-widest appearance-none cursor-pointer ${className}`}
        {...props}
    >
        {children}
    </select>
);

const AssetEntryForm = ({ categories, initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', brand: '', price: '', launchYear: '', type: 'car', category: [], description: '',
        features: '', pros: '', cons: '', colors: '',
        // Specs
        engine: '', mileage: '', topSpeed: '', zeroToHundred: '', fuelType: [], transmission: '', driveType: '', power: '', torque: '',
        customFuelType: '', batteryCapacity: '', drivingRange: '', chargingTime: '', maxChargingPower: '', evDescription: '',
        // Dimensions
        seating: '', weight: '', fuelTank: '', groundClearance: '', wheelbase: ''
    });

    const [images, setImages] = useState([]); // Array of Files or Strings (URLs)
    const [previews, setPreviews] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Populate Data on Edit
    useState(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                brand: initialData.brand || '',
                price: initialData.price || '',
                launchYear: initialData.launchYear || '',
                type: initialData.type || 'car',
                category: Array.isArray(initialData.category) ? initialData.category : (initialData.category ? [initialData.category] : []),
                description: initialData.description || '',
                features: Array.isArray(initialData.features) ? initialData.features.join(', ') : (initialData.features || ''),
                pros: Array.isArray(initialData.pros) ? initialData.pros.join(', ') : (initialData.pros || ''),
                cons: Array.isArray(initialData.cons) ? initialData.cons.join(', ') : (initialData.cons || ''),
                colors: Array.isArray(initialData.colors) ? initialData.colors.join(', ') : (initialData.colors || ''),
                // Specs
                engine: initialData.specs?.engine || '',
                mileage: initialData.specs?.mileage || '',
                topSpeed: initialData.specs?.topSpeed || '',
                zeroToHundred: initialData.specs?.zeroToHundred || '',
                fuelType: Array.isArray(initialData.specs?.fuelType) ? initialData.specs.fuelType : (initialData.specs?.fuelType ? [initialData.specs.fuelType] : []),
                transmission: initialData.specs?.transmission || '',
                driveType: initialData.specs?.driveType || '',
                power: initialData.specs?.power || '',
                torque: initialData.specs?.torque || '',
                batteryCapacity: initialData.specs?.batteryCapacity || '',
                drivingRange: initialData.specs?.drivingRange || '',
                chargingTime: initialData.specs?.chargingTime || '',
                maxChargingPower: initialData.specs?.maxChargingPower || '',
                evDescription: initialData.specs?.evDescription || '',
                // Dimensions
                seating: initialData.dimensions?.seating || '',
                weight: initialData.dimensions?.weight || '',
                fuelTank: initialData.dimensions?.fuelTank || '',
                groundClearance: initialData.dimensions?.groundClearance || '',
                wheelbase: initialData.dimensions?.wheelbase || ''
            });

            if (initialData.images && initialData.images.length > 0) {
                setImages(initialData.images);
                setPreviews(initialData.images);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryToggle = (categoryName) => {
        setFormData(prev => {
            const currentCategories = Array.isArray(prev.category) ? prev.category : [];
            if (currentCategories.includes(categoryName)) {
                return { ...prev, category: currentCategories.filter(c => c !== categoryName) };
            } else {
                return { ...prev, category: [...currentCategories, categoryName] };
            }
        });
    };

    const handleFuelTypeToggle = (fuel) => {
        setFormData(prev => {
            const currentFuels = Array.isArray(prev.fuelType) ? prev.fuelType : [];
            if (currentFuels.includes(fuel)) {
                return { ...prev, fuelType: currentFuels.filter(f => f !== fuel) };
            } else {
                return { ...prev, fuelType: [...currentFuels, fuel] };
            }
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFiles = (files) => {
        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        const removedImage = newImages.splice(index, 1)[0];
        setImages(newImages);

        const newPreviews = [...previews];
        const removedPreview = newPreviews.splice(index, 1)[0];
        setPreviews(newPreviews);

        // Revoke URL only if it was a blob (file), not a cloud string
        if (typeof removedPreview === 'string' && removedPreview.startsWith('blob:')) {
            URL.revokeObjectURL(removedPreview);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.category || formData.category.length === 0) {
            toast.error('Please select at least one category');
            return;
        }

        // Construct Payload
        // Note: We need to send FormData for file uploads
        const payload = new FormData();

        // Append basic fields, handle fuelType array and customFuelType
        Object.keys(formData).forEach(key => {
            if (key === 'fuelType') {
                const fuels = Array.isArray(formData.fuelType) ? formData.fuelType : [];
                const hasOther = fuels.includes('Other (Write Custom)');
                // Replace 'Other (Write Custom)' with customFuelType value if provided
                const finalFuels = hasOther && formData.customFuelType
                    ? [...fuels.filter(f => f !== 'Other (Write Custom)'), formData.customFuelType]
                    : fuels.filter(f => f !== 'Other (Write Custom)');
                finalFuels.forEach(f => payload.append('fuelType', f));
            } else if (key !== 'customFuelType') {
                payload.append(key, formData[key]);
            }
        });

        // Append images - Split into 'images' (new files) and 'existingImages' (urls)
        images.forEach(image => {
            if (typeof image === 'string') {
                payload.append('existingImages', image);
            } else {
                payload.append('images', image);
            }
        });

        onSubmit(payload);
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#0a0a0a] border border-white/5 p-4 sm:p-8 md:p-12 relative overflow-hidden group"
        >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent opacity-50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent opacity-50" />

            {/* Header: Flex layout to move buttons to the right on desktop */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-4xl font-display font-black italic text-white uppercase tracking-tighter">
                    New Asset <span className="text-accent underline decoration-accent/30 underline-offset-8">Entry</span>
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 sm:w-auto">
                    <Button 
                        variant="secondary" 
                        onClick={onCancel} 
                        className="w-full sm:w-auto border-white/10 hover:border-white/40 transition-all px-4 sm:px-8 flex items-center justify-center gap-2 group"
                    >
                        <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-xs tracking-[0.2em] font-bold">Cancel</span>
                    </Button>
                    <Button 
                        type="submit" 
                        form="asset-form" 
                        variant="primary" 
                        className="w-full sm:w-auto px-4 sm:px-10 flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        <span className="text-[10px] sm:text-xs tracking-[0.2em] font-bold">Deploy Asset</span>
                    </Button>
                </div>
            </div>

            <motion.form id="asset-form" variants={staggerContainer} initial="hidden" animate="show" onSubmit={handleSubmit} className="space-y-12">

                {/* 1. Identification */}
                <motion.section variants={fadeInUp}>
                    <SectionHeader title="Identification / Classification" icon={Car} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputGroup label="Vehicle Name">
                            <StyledInput name="name" value={formData.name} onChange={handleChange} placeholder="e.g. GT-R Nismo" required />
                        </InputGroup>
                        <InputGroup label="Manufacturer / Brand">
                            <StyledInput name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Nissan" required />
                        </InputGroup>
                        <InputGroup label="Base Price (₹)">
                            <StyledInput type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" required />
                        </InputGroup>
                        <InputGroup label="Launch Year">
                            <StyledInput type="number" name="launchYear" value={formData.launchYear} onChange={handleChange} placeholder="2024" />
                        </InputGroup>
                        <InputGroup label="Type">
                            <StyledSelect name="type" value={formData.type} onChange={handleChange}>
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                            </StyledSelect>
                        </InputGroup>
                        <InputGroup label={`Category (Select Multiple)`}>
                            <div className="bg-[#111] border border-white/20 rounded-[2px] p-3 shadow-inner max-h-48 overflow-y-auto">
                                <div className="flex flex-wrap gap-2">
                                    {categories.filter(c => c.type === formData.type).map(cat => {
                                        const isSelected = Array.isArray(formData.category) && formData.category.includes(cat.name);
                                        return (
                                            <button
                                                key={cat._id}
                                                type="button"
                                                onClick={() => handleCategoryToggle(cat.name)}
                                                className={`px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-200 border ${isSelected
                                                    ? 'bg-accent/20 border-accent text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                                    : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        );
                                    })}
                                    {categories.filter(c => c.type === formData.type).length === 0 && (
                                        <span className="text-gray-500 text-xs italic">No categories available for this type.</span>
                                    )}
                                </div>
                            </div>
                        </InputGroup>
                    </div>
                </motion.section>

                {/* 2. Performance Specs */}
                <motion.section variants={fadeInUp}>
                    <SectionHeader title="Performance Telemetry" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <InputGroup label="Engine Config">
                            <StyledInput name="engine" value={formData.engine} onChange={handleChange} placeholder="e.g. 3.8L V6 Twin-Turbo" />
                        </InputGroup>
                        <InputGroup label="Power Output">
                            <StyledInput name="power" value={formData.power} onChange={handleChange} placeholder="e.g. 600 HP" />
                        </InputGroup>
                        <InputGroup label="Torque">
                            <StyledInput name="torque" value={formData.torque} onChange={handleChange} placeholder="e.g. 652 Nm" />
                        </InputGroup>
                        <InputGroup label="Top Speed">
                            <StyledInput name="topSpeed" value={formData.topSpeed} onChange={handleChange} placeholder="e.g. 330 km/h" />
                        </InputGroup>
                        <InputGroup label="0-100 km/h">
                            <StyledInput name="zeroToHundred" value={formData.zeroToHundred} onChange={handleChange} placeholder="e.g. 2.5s" />
                        </InputGroup>
                        <InputGroup label="Transmission">
                            <StyledInput name="transmission" value={formData.transmission} onChange={handleChange} placeholder="e.g. 6-Speed Dual-Clutch" />
                        </InputGroup>
                        <InputGroup label="Drive Type">
                            <StyledSelect name="driveType" value={formData.driveType} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="RWD">RWD</option>
                                <option value="FWD">FWD</option>
                                <option value="AWD">AWD</option>
                                <option value="4WD">4WD</option>
                            </StyledSelect>
                        </InputGroup>
                        <InputGroup label="Fuel / Energy Type (Select Multiple)">
                            <div className="bg-[#111] border border-white/20 rounded-[2px] p-3 shadow-inner">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        'Petrol',
                                        'Diesel',
                                        'Petrol Hybrid (Mild Hybrid)',
                                        'Petrol Hybrid',
                                        'Plug-in Hybrid (Petrol + Electric)',
                                        'Fully Electric (Battery EV)',
                                        'Other (Write Custom)',
                                    ].map(fuel => {
                                        const isSelected = Array.isArray(formData.fuelType) && formData.fuelType.includes(fuel);
                                        return (
                                            <button
                                                key={fuel}
                                                type="button"
                                                onClick={() => handleFuelTypeToggle(fuel)}
                                                className={`px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-200 border ${isSelected
                                                        ? 'bg-accent/20 border-accent text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                                    }`}
                                            >
                                                {fuel}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {Array.isArray(formData.fuelType) && formData.fuelType.includes('Other (Write Custom)') && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                    <StyledInput name="customFuelType" value={formData.customFuelType} onChange={handleChange} placeholder="Enter custom fuel type..." autoFocus />
                                </motion.div>
                            )}
                        </InputGroup>
                    </div>
                </motion.section>

                {/* EV Specific Specs */}
                {Array.isArray(formData.fuelType) && formData.fuelType.some(f => [
                    'fully electric (battery ev)',
                    'plug-in hybrid (petrol + electric)',
                    'electric',
                    'ev'
                ].includes(f.toLowerCase())) && (
                        <motion.section variants={fadeInUp} className="mt-12">
                            <SectionHeader title="EV Specifications" icon={Zap} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                <InputGroup label="Battery Capacity (Optional)">
                                    <StyledInput name="batteryCapacity" value={formData.batteryCapacity} onChange={handleChange} placeholder="e.g. 83.9 kWh" />
                                </InputGroup>
                                <InputGroup label="Driving Range (WLTP) (Optional)">
                                    <StyledInput name="drivingRange" value={formData.drivingRange} onChange={handleChange} placeholder="e.g. 450 - 590 KM" />
                                </InputGroup>
                                <InputGroup label="DC Fast Charging (Optional)">
                                    <StyledInput name="chargingTime" value={formData.chargingTime} onChange={handleChange} placeholder="e.g. 10-80% in ~30 mins" />
                                </InputGroup>
                                <InputGroup label="Max DC Charging Power (Optional)">
                                    <StyledInput name="maxChargingPower" value={formData.maxChargingPower} onChange={handleChange} placeholder="e.g. Up to 205 kW" />
                                </InputGroup>
                                <div className="col-span-2 md:col-span-4">
                                    <InputGroup label="EV Technology Highlights (Optional)">
                                        <textarea
                                            className="w-full bg-[#111] border border-white/20 rounded-[2px] p-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:bg-white/10 transition-all duration-200 font-bold text-sm shadow-inner"
                                            rows="2"
                                            name="evDescription"
                                            value={formData.evDescription}
                                            onChange={handleChange}
                                            placeholder="e.g. BMW's fifth-generation eDrive system enables long-distance range..."
                                        />
                                    </InputGroup>
                                </div>
                            </div>
                        </motion.section>
                    )}

                {/* 3. Dimensions */}
                <motion.section variants={fadeInUp}>
                    <SectionHeader title="Dimensional Data" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                        <InputGroup label="Seating Cap.">
                            <StyledInput type="number" name="seating" value={formData.seating} onChange={handleChange} placeholder="2" />
                        </InputGroup>
                        <InputGroup label="Kerb Weight">
                            <StyledInput name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 1725 kg" />
                        </InputGroup>
                        <InputGroup label={Array.isArray(formData.fuelType) && formData.fuelType.includes('Fully Electric (Battery EV)') ? "Boot Space" : "Fuel Tank"}>
                            <StyledInput name="fuelTank" value={formData.fuelTank} onChange={handleChange} placeholder={Array.isArray(formData.fuelType) && formData.fuelType.includes('Fully Electric (Battery EV)') ? "e.g. 400 L" : "e.g. 74 L"} />
                        </InputGroup>
                        <InputGroup label="Ground Clearance">
                            <StyledInput name="groundClearance" value={formData.groundClearance} onChange={handleChange} placeholder="e.g. 110 mm" />
                        </InputGroup>
                        <InputGroup label="Wheelbase">
                            <StyledInput name="wheelbase" value={formData.wheelbase} onChange={handleChange} placeholder="e.g. 2780 mm" />
                        </InputGroup>
                    </div>
                </motion.section>

                {/* 4. Media Upload */}
                <motion.section variants={fadeInUp}>
                    <SectionHeader title="Visual Assets" icon={Upload} />

                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`border-2 border-dashed transition-all duration-200 p-10 text-center cursor-pointer mb-6 relative overflow-hidden group rounded-[2px]
                            ${dragActive ? 'border-accent bg-accent/5 scale-[1.02] shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-white/10 hover:border-accent/50 bg-black/20 hover:bg-white/5'}
                        `}
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                        <div className="flex flex-col items-center gap-4 relative z-10">
                            <motion.div
                                animate={dragActive ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
                                className="p-4 rounded-full bg-white/5 group-hover:bg-accent/20 transition-colors"
                            >
                                <Upload className={`w-8 h-8 transition-colors ${dragActive ? 'text-accent' : 'text-gray-500 group-hover:text-accent'}`} />
                            </motion.div>
                            <div>
                                <h4 className={`font-bold uppercase tracking-widest text-sm mb-1 transition-colors ${dragActive ? 'text-accent' : 'text-white'}`}>Drag & Drop Images</h4>
                                <p className="text-gray-500 text-xs pt-1 border-t border-white/10 mt-2 mx-auto w-max">or click to browse from device</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Previews */}
                    <AnimatePresence>
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {previews.map((src, idx) => (
                                    <motion.div
                                        key={src}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative aspect-video group"
                                    >
                                        <img src={src} alt="Preview" className="w-full h-full object-cover border border-white/10" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="p-2 bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* 5. Detailed Info */}
                <motion.section variants={fadeInUp}>
                    <SectionHeader title="Detailed Specification" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Features (Comma Separated)">
                            <textarea
                                className="w-full bg-[#111] border border-white/20 rounded-[2px] p-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:bg-white/10 transition-all duration-200 font-bold text-sm shadow-inner"
                                rows="4"
                                name="features"
                                value={formData.features}
                                onChange={handleChange}
                                placeholder="e.g. Bose Audio, Heads-up Display, Carbon Fiber Roof"
                            />
                        </InputGroup>
                        <InputGroup label="Description">
                            <textarea
                                className="w-full bg-[#111] border border-white/20 rounded-[2px] p-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:bg-white/10 transition-all duration-200 font-bold text-sm shadow-inner"
                                rows="4"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Marketing copy and detailed breakdown..."
                            />
                        </InputGroup>
                        <InputGroup label="Colors (Comma Separated)">
                            <StyledInput name="colors" value={formData.colors} onChange={handleChange} placeholder="e.g. Ultimate Silver, Vibrant Red, Pearl White" />
                        </InputGroup>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputGroup label="Pros (Comma Separated)">
                                <textarea className="w-full bg-[#111] border border-white/20 rounded-[2px] text-white p-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:bg-white/10 transition-all duration-200 shadow-inner" rows="3" name="pros" value={formData.pros} onChange={handleChange} />
                            </InputGroup>
                            <InputGroup label="Cons (Comma Separated)">
                                <textarea className="w-full bg-[#111] border border-white/20 rounded-[2px] text-white p-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:bg-white/10 transition-all duration-200 shadow-inner" rows="3" name="cons" value={formData.cons} onChange={handleChange} />
                            </InputGroup>
                        </div>
                    </div>
                </motion.section>
            </motion.form>
        </motion.div>
    );
};

export default AssetEntryForm;
