import User from "../../../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../helper/generateToken.js";
import validator from "validator"
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "fill all required fields",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "the email not valid" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "email not exist" });
    }
    const VPassword = bcrypt.compareSync(password, user.password);
    if (!VPassword) {
      return res.status(400).json({ message: "password is incorrect" });
    }
    const token =  generateToken(user.id);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log("error in login user route");
    console.log(error.message);
  }
};

export default loginUser;
