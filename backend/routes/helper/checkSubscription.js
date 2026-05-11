import User from "../../models/user.model.js";

const PLAN_LIMITS = {
  free: 5,
  pro: 20,
  premium: Infinity,
};

const checkSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const limit = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

    if (user.predictionsUsed >= limit) {
      return res.status(403).json({
        message: "You have reached your prediction limit. Please upgrade your plan.",
        plan: user.plan,
        predictionsUsed: user.predictionsUsed,
        limit: limit === Infinity ? "unlimited" : limit,
      });
    }

    req.userDoc = user;
    return next();
  } catch (error) {
    console.log("error in checkSubscription middleware");
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default checkSubscription;
