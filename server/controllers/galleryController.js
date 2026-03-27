import { cloudinary } from '../config/cloudinary.js';

export const getGalleryImages = async (req, res) => {
    try {
        const folder = req.query.folder || 'STREET MACHINE';
        const result = await cloudinary.search
            .expression(`folder:"${folder}"`)
            .sort_by('public_id', 'desc')
            .max_results(500)
            .execute();

        const images = result.resources.map(image => ({
            public_id: image.public_id,
            url: image.secure_url,
            width: image.width,
            height: image.height,
            format: image.format,
            name: image.public_id.split('/').pop().split('.')[0] // Extract name for logos
        }));

        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
