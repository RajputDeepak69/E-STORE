const User = require("../models/user");

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: "Access denied: Admins only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = adminOnly;