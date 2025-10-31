import Review from '../models/Review.js';

export const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const existing = await Review.findOne({ productId, userId: req.user.id });
  if (existing) return res.status(400).json({ message: 'You already reviewed this product' });
  const review = await Review.create({ productId, userId: req.user.id, rating, comment });
  res.status(201).json(review);
};

export const getReviewsByProduct = async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ productId: id })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .lean();
  res.json(reviews);
};

export const getRatingSummary = async (req, res) => {
  const { id } = req.params;
  const pipeline = [
    { $match: { productId: new (await import('mongoose')).default.Types.ObjectId(id) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } }
  ];
  const breakdown = await Review.aggregate(pipeline);
  const averageAgg = await Review.aggregate([
    { $match: { productId: new (await import('mongoose')).default.Types.ObjectId(id) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
  ]);
  const average = averageAgg[0] || { avgRating: 0, reviewCount: 0 };
  res.json({
    avgRating: Number(average.avgRating || 0),
    reviewCount: average.reviewCount || 0,
    breakdown: breakdown.reduce((acc, b) => ({ ...acc, [b._id]: b.count }), {})
  });
};
