const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

const port = 3000;

const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect(
    "mongodb+srv://milandetruja:milan6401@cluster0.ckovpel.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((response) => {
    console.log("connect");
  })
  .catch((error) => {
    console.log("error connecting to server");
  });

app.listen(port, () => {
  console.log(`port connected ${port}`);
});

const User = require("./models/user");
const Post = require("./models/post");

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("req.body", req.body);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

    // send the verification user email
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({
      message: "user registered successfully",
      verificationToken: newUser.verificationToken,
    });
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "error registering user" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  // create nodemail transport

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "milandetruja2@gmail.com",
      pass: "mlgz nhkb aium gcnd",
    },
  });

  const mailOptions = {
    form: "thre.app",
    to: email,
    subject: "Email Verification",
    text: `Please clike the following  link to verify your email http://localhost:3000/verify/${verificationToken}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending meassage", error);
  }
};

app.get("/verify/:token", async () => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      verificationToken: token,
    });
    if (!user) {
      return res.status(400).json({ message: "invalid token" });
    }
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "email verified" });
  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "email verification failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const secretKey = "iadiashdioashdiuahdiaudhiasuoh";
    const token = jwt.sign({ userId: user._id }, secretKey);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
