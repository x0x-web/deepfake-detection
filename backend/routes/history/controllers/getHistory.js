import History from "../../../models/history.model.js";

const getHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json(history);
  } catch (error) {
    console.log("Error in getHistory controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getHistory;
