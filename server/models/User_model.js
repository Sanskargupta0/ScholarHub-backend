const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    default: "",
  },
  avatarURL: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  bookmarks: {
    type: Array,
    default: [],
  },
  facebook: {
    type: String,
    default: "",
  },
  instagram: {
    type: String,
    default: "",
  },
  twitter: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  rollNumber: {
    type: Number,
    default: 0,
  },
  notifications: {
    type: Array,
    default: [],
  }
});

//secure password
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  } else {
    try {
      const saltRound = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(user.password, saltRound);
      user.password = hash_password;
    } catch (error) {
      next(error);
    }
  }
});

userSchema.methods.generateAuthToken = function (rememberMe) {
  const user = this;
  const time = rememberMe ? "7d" : "1h";
  try {
    const token = jwt.sign(
      { userid: user._id.toString(), email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: time }
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  try {
    const isMatch = bcrypt.compare(password, user.password);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
