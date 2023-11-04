const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const jwtDecode = require("jwt-decode");
const user = require("./models/user");
const app = express();

const port = 3003;

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
  .then(() => {
    console.log("connect");
  })
  .catch((err) => {
    console.log("error connecting to server");
  });

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

const User = require("./models/user");
const Post = require("./models/post");

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ name, email, password });

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({ message: "Registration successful" });
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
    form: "threads.com",
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
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

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
    const token = jwt.sign({ userId: user._id }, secretKey);

    const decodeToken = jwt.verify(token, secretKey);

    return res.status(200).json({
      message: "Login successfully",
      token,
      userId: decodeToken.userId,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error });
  }
});

app.get("/user/:userId", (req, res) => {
  try {
    const userId = req.params.userId;
    User.find({ _id: { $ne: userId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error", error);
        res.status(500).json({ message: "error" });
      });
  } catch (error) {
    console.log("error getting user", error);
    res.status(403).json({ message: "error while getting user" });
  }
});

// endpoint to follow particuler user
app.post("/follow", async (req, res) => {
  const { currentuserId, seletedUserId } = req.body;
  try {
    const userId = user.findByIdAndUpdate(seletedUserId, {
      $push: { followers: currentuserId },
    });
    res.status(200).json({ message: "Following successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error, message: " error in following user " });
  }
});
app.post("/user/unfollow", async (req, res) => {
  const { loggedUserId, targetUserId } = req.body;
  try {
    const userId = user.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedUserId },
    });
    res.status(200).json({ message: "unFollowing successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error, message: " error unFollowing user " });
  }
});
