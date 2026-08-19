const User = require("../models/User");
const Interview = require("../models/Interview");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/admin/stats
// High-level platform stats: total users, total interviews, average score,
// signups this week, and the most commonly missed questions (a decent proxy
// for spotting confusing or badly-generated AI questions).
const getStats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalInterviews, completedAgg, recentSignups, roleBreakdown, providerBreakdown] = await Promise.all([
    User.countDocuments(),
    Interview.countDocuments({ status: "completed" }),
    Interview.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, avgScore: { $avg: "$score" }, avgTime: { $avg: "$timeSpentSeconds" } } },
    ]),
    User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
    Interview.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$role", count: { $sum: 1 }, avgScore: { $avg: "$score" } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Interview.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]),
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalInterviews,
      avgScore: Math.round(completedAgg[0]?.avgScore || 0),
      avgTimeSpentSeconds: Math.round(completedAgg[0]?.avgTime || 0),
      newUsersThisWeek: recentSignups,
      roleBreakdown: roleBreakdown.map((r) => ({ role: r._id, count: r.count, avgScore: Math.round(r.avgScore) })),
      sourceBreakdown: providerBreakdown.map((s) => ({ source: s._id, count: s.count })),
    },
  });
});

// @route GET /api/admin/users
// Paginated list of all users (no passwords) for basic user management visibility.
const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 25);

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(),
  ]);

  res.json({
    success: true,
    users: users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      authProvider: u.authProvider,
      createdAt: u.createdAt,
    })),
    page,
    totalPages: Math.ceil(total / limit),
    totalUsers: total,
  });
});

module.exports = { getStats, listUsers };
