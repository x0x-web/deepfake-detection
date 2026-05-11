import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../../../models/user.model.js";
const registerUser = async (req, res) => {
  try {
    console.log(req)
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "fill all required fields",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "the email not valid" });
    }
    const user = await User.findOne({email});
    if (user) {
      return res.status(400).json({ message: "the email already exist" });
    }
    
    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "the password is weak" });
    }
    const hash = bcrypt.hashSync(password, 10);

    await User.create({
      name,
      email,
      password: hash,
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.log("error in register user route");
    console.log(error.message);
  }
};

export default registerUser;
