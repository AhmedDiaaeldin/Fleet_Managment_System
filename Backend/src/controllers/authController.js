const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js"); // Renamed to User

exports.register = async (req, res, next) => {
  try {
    // Destructure all necessary fields from req.body
    const { name, email, phone, password } = req.body;

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user instance with all fields
    const newUser = new User({ // Use User
      name,
      email,
      phone,
      password: passwordHash
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send back the created user
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Change variable name to foundUser
    const foundUser = await User.findOne({ email: req.body.email }); // Use User

    if (!foundUser) {
      return res.status(401).json("There is no such user!");
    }

    if (foundUser.status === "passive") { // Use foundUser
      return res.status(404).json("Your account is inactive!");
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      foundUser.password // Use foundUser
    );

    if (!isPasswordCorrect) {
      return res.status(401).json("Wrong e-mail or password!");
    }

    const token = jwt.sign({ id: foundUser._id,
        name: foundUser.name }, process.env.JWT_SECRET); // Use JWT_SECRET, ensure it's set in your .env

    res.json({ message: "Welcome Back", token: token });

    // You can uncomment and adjust the following lines if needed
    // const { password, ...otherDetails } = foundUser._doc;
    // res
    //   .cookie("access_token", token, {
    //     httpOnly: true,
    //   })
    //   .status(200)
    //   .json({ ...otherDetails });
  } catch (err) {
    next(err);
  }
};
