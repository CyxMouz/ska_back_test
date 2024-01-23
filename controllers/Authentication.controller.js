const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

exports.register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  try {
    const user = new User({
      firstname,
      lastname,
      username,
      email,
      password,
    });

    await user.save();
    return res
      .status(200)
      .json({ message: "Registration successful", user: user });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const { firstname, lastname, email } = user;
    return res.status(200).json({
      token: `Bearer ${token}`,
      firstname,
      lastname,
      email,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
