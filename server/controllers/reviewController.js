import Review from '../models/Review.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Get reviews for a vehicle
// @route   GET /api/reviews/:vehicleId
// @access  Public
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ vehicle: req.params.vehicleId }).populate('user', 'username');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    const { rating, comment, vehicleId } = req.body;

    try {
        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            vehicle: vehicleId,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Vehicle already reviewed' });
        }

        const review = await Review.create({
            user: req.user._id,
            vehicle: vehicleId,
            rating: Number(rating),
            comment,
        });

        // Update vehicle rating (average)
        const reviews = await Review.find({ vehicle: vehicleId });
        vehicle.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        await vehicle.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
