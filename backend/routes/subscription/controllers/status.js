import User from "../../../models/user.model.js";

const PLAN_LIMITS = { free: 5, pro: 20, premium: Infinity };

const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const limit = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

    return res.status(200).json({
      plan: user.plan,
      predictionsUsed: user.predictionsUsed,
      limit: limit === Infinity ? "unlimited" : limit,
      remaining: limit === Infinity ? "unlimited" : Math.max(0, limit - user.predictionsUsed),
    });
  } catch (error) {
    console.log("error in getSubscriptionStatus");
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getSubscriptionStatus;
