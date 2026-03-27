import Vehicle from '../models/Vehicle.js';

// @desc    Fetch all vehicles
// @route   GET /api/vehicles
// @access  Public
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (vehicle) {
            res.json(vehicle);
        } else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
export const createVehicle = async (req, res) => {
    try {

        const {
            name,
            brand,
            type,
            category,
            price,
            launchYear,
            description,
            features,
            pros,
            cons,
            colors,
            // Specs
            engine,
            mileage,
            topSpeed,
            zeroToHundred,
            fuelType,
            transmission,
            driveType,
            power,
            torque,
            // EV Specs
            batteryCapacity,
            drivingRange,
            chargingTime,
            maxChargingPower,
            evDescription,
            // Dimensions
            seating,
            weight,
            fuelTank,
            groundClearance,
            wheelbase
        } = req.body;

        let images = [];

        // Handle File Uploads
        if (req.files && req.files.length > 0) {
            // Cloudinary storage provides 'path' or 'secure_url'
            images = req.files.map(file => file.path);
        } else if (req.body.images) {
            // Handle comma-separated URLs if provided manually
            images = req.body.images.split(',').map(url => url.trim());
        }

        // Basic Validation
        const missingFields = [];
        if (!name) missingFields.push('Name');
        if (!brand) missingFields.push('Brand');
        if (price === undefined || price === '' || price === null) missingFields.push('Price');
        if (!category || category.length === 0) missingFields.push('Category');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Validate Number Fields
        if (isNaN(Number(price))) {
            return res.status(400).json({ message: 'Price must be a valid number' });
        }
        if (launchYear && isNaN(Number(launchYear))) {
            return res.status(400).json({ message: 'Launch Year must be a valid number (e.g. 2024)' });
        }

        const vehicle = new Vehicle({
            name,
            brand,
            type,
            category: category && typeof category === 'string' ? category.split(',').map(c => c.trim()).filter(x => x) : (category || []),
            price: Number(price), // Ensure number
            launchYear: launchYear ? Number(launchYear) : undefined,
            description,
            images,
            features: features && typeof features === 'string' ? features.split(',').map(f => f.trim()) : [],
            pros: pros && typeof pros === 'string' ? pros.split(',').map(p => p.trim()) : [],
            cons: cons && typeof cons === 'string' ? cons.split(',').map(c => c.trim()) : [],
            colors: colors && typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : [],
            specs: {
                engine,
                mileage,
                topSpeed,
                zeroToHundred,
                fuelType,
                transmission,
                driveType,
                power,
                torque,
                batteryCapacity,
                drivingRange,
                chargingTime,
                maxChargingPower,
                evDescription,
            },
            dimensions: {
                seating: seating ? Number(seating) : undefined,
                weight,
                fuelTank,
                groundClearance,
                wheelbase
            },
            user: req.user._id,
        });

        const createdVehicle = await vehicle.save();
        res.status(201).json(createdVehicle);
    } catch (error) {
        console.error('Create Vehicle Error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (vehicle) {
            await Vehicle.deleteOne({ _id: req.params.id });
            res.json({ message: 'Vehicle removed' });
        } else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
export const updateVehicle = async (req, res) => {
    try {

        const {
            name,
            brand,
            type,
            category,
            price,
            launchYear,
            description,
            features,
            pros,
            cons,
            colors,
            // Specs
            engine,
            mileage,
            topSpeed,
            zeroToHundred,
            fuelType,
            transmission,
            driveType,
            power,
            torque,
            // EV Specs
            batteryCapacity,
            drivingRange,
            chargingTime,
            maxChargingPower,
            evDescription,
            // Dimensions
            seating,
            weight,
            fuelTank,
            groundClearance,
            wheelbase
        } = req.body;

        const vehicle = await Vehicle.findById(req.params.id);

        if (vehicle) {
            vehicle.name = name || vehicle.name;
            vehicle.brand = brand || vehicle.brand;
            vehicle.type = type || vehicle.type;
            vehicle.category = category || vehicle.category;
            vehicle.price = price ? Number(price) : vehicle.price;
            vehicle.launchYear = launchYear ? Number(launchYear) : vehicle.launchYear;
            vehicle.description = description || vehicle.description;

            // Handle Images
            // 1. Existing images passed as strings (or empty array if all deleted)
            let existingImages = req.body.existingImages;
            if (typeof existingImages === 'string') {
                existingImages = [existingImages];
            } else if (!existingImages) {
                existingImages = [];
            }

            // 2. New images uploaded
            let newImages = [];
            if (req.files && req.files.length > 0) {
                newImages = req.files.map(file => file.path);
            }

            // Combine
            vehicle.images = [...existingImages, ...newImages];

            // Handle Arrays (Features, Pros, Cons, Colors, Category)
            // If sent as string (comma separated), split it. If array, use as is.
            if (category !== undefined) vehicle.category = typeof category === 'string' ? category.split(',').map(c => c.trim()).filter(x => x) : category;
            if (features !== undefined) vehicle.features = typeof features === 'string' ? features.split(',').map(f => f.trim()).filter(x => x) : features;
            if (pros !== undefined) vehicle.pros = typeof pros === 'string' ? pros.split(',').map(p => p.trim()).filter(x => x) : pros;
            if (cons !== undefined) vehicle.cons = typeof cons === 'string' ? cons.split(',').map(c => c.trim()).filter(x => x) : cons;
            if (colors !== undefined) vehicle.colors = typeof colors === 'string' ? colors.split(',').map(c => c.trim()).filter(x => x) : colors;

            // Handle Nested Objects (Specs, Dimensions)
            // We use Object.assign logic or direct assignment if provided
            if (vehicle.specs) {
                vehicle.specs.engine = engine || vehicle.specs.engine;
                vehicle.specs.mileage = mileage || vehicle.specs.mileage;
                vehicle.specs.topSpeed = topSpeed || vehicle.specs.topSpeed;
                vehicle.specs.zeroToHundred = zeroToHundred || vehicle.specs.zeroToHundred;
                vehicle.specs.fuelType = fuelType || vehicle.specs.fuelType;
                vehicle.specs.transmission = transmission || vehicle.specs.transmission;
                vehicle.specs.driveType = driveType || vehicle.specs.driveType;
                vehicle.specs.power = power || vehicle.specs.power;
                vehicle.specs.torque = torque || vehicle.specs.torque;
                vehicle.specs.batteryCapacity = batteryCapacity || vehicle.specs.batteryCapacity;
                vehicle.specs.drivingRange = drivingRange || vehicle.specs.drivingRange;
                vehicle.specs.chargingTime = chargingTime || vehicle.specs.chargingTime;
                vehicle.specs.maxChargingPower = maxChargingPower || vehicle.specs.maxChargingPower;
                vehicle.specs.evDescription = evDescription || vehicle.specs.evDescription;
            }

            if (vehicle.dimensions) {
                vehicle.dimensions.seating = seating ? Number(seating) : vehicle.dimensions.seating;
                vehicle.dimensions.weight = weight || vehicle.dimensions.weight;
                vehicle.dimensions.fuelTank = fuelTank || vehicle.dimensions.fuelTank;
                vehicle.dimensions.groundClearance = groundClearance || vehicle.dimensions.groundClearance;
                vehicle.dimensions.wheelbase = wheelbase || vehicle.dimensions.wheelbase;
            }

            const updatedVehicle = await vehicle.save();
            res.json(updatedVehicle);
        } else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    } catch (error) {
        console.error('Update Vehicle Error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
