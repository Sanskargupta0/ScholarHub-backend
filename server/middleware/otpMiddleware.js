const User = require("../models/User_model");
const otpMiddleware = () => async (req, res, next) => {
    try {
      const Userstate = await User.findOne({ email: req.body.email.toLowerCase() });
      const isVerfied = Userstate.isVerified;
      if (isVerfied) {
        res.status(200).json({ msg: "You are already Verfied" });
      } else {
        next();
      }
    } catch (error) {
      const err = {
        status: 422,
        msg: "You are not registered"
      };
      next(err);
    }
  };

    module.exports = otpMiddleware;