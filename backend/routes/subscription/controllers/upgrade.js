import User from "../../../models/user.model.js";

const VALID_PLANS = ["free", "pro", "premium"];

const upgradePlan = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !VALID_PLANS.includes(plan)) {
      return res.status(400).json({
        message: "Invalid plan. Choose from: free, pro, premium",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.plan = plan;
    // Reset predictions used when upgrading
    user.predictionsUsed = 0;
    await user.save();

    return res.status(200).json({
      message: `Plan upgraded to ${plan} successfully`,
      plan: user.plan,
      predictionsUsed: user.predictionsUsed,
    });
  } catch (error) {
    console.log("error in upgradePlan");
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default upgradePlan;
