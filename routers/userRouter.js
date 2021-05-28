const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// register
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required data." });

    if (password.length < 8)
      return res
        .status(400)
        .json({ errorMessage: "Password must be at least 8 characters long." });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ errorMessage: "Account with this email already exists." });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ email, passwordHash });

    const savedUser = await user.save();

    //log in the user via token

    const token = jwt.sign(
      {
        user: savedUser._id,
        admin: 0,
      },
      process.env.JWT
    );

    // sending cookie in HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required data." });

    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    //log in the user via token

    const token = jwt.sign(
      {
        user: existingUser._id,
        admin: existingUser.admin,
      },
      process.env.JWT
    );

    // sending cookie in HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();

    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Wrong email or password." });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

module.exports = router;
