const User = require("../models/User");
const Challenge = require("../models/Challenge");
const fs = require("fs");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const enrolledCount = await Challenge.countDocuments({
      participants: req.user.id,
    });

    res.json({
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      createdAt: user.createdAt,
      enrolledCount,
      completedCount: 0,
      badgeCount: 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;

    const user = await User.findById(req.user.id);

    if (user.avatar) {
      const oldPath = user.avatar.replace(
        `${req.protocol}://${req.get("host")}/`, ""
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar = avatarUrl;
    await user.save();

    res.json({ avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Name and email required" });

    const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json({ name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile, updateAvatar, updateProfile };