const User = require("../models/User_model");
const Otp = require("../models/Otp_model");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/sendmail");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const io = req.io;
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists && userExists.isVerified) {
      res.status(400).json({ msg: "user already exists" });
    } else {
      if (userExists) {
        await userExists.updateOne({
          firstName,
          lastName,
          email: email.toLowerCase(),
          password: await genrateNewPass(password),
          avatarURL: generateAvatar(),
        });
        res.status(201).json({
          msg: "Reregistation successful",
          email: email.toLowerCase(),
        });
      } else {
        const userCreated = await User.create({
          firstName,
          lastName,
          email: email.toLowerCase(),
          password,
          avatarURL: generateAvatar(),
        });
        let currentUTC = new Date();
        let currentIST = new Date(currentUTC.getTime() + 5.5 * 60 * 60 * 1000);
        const notification = {
          title: "Welcome to the community",
          description: `Thanks for joining this  community ${firstName} ${lastName}`,
          date: currentIST,
        };
        userCreated.notifications.push(notification);
        userCreated.save();
        io.to(userCreated._id).emit("newNotification", notification);
        res.status(201).json({
          msg: "Registation successful",
          email: email.toLowerCase(),
        });
      }
    }
  } catch (error) {
    err = {
      msg: "Registation failed",
      status: 500,
      extraD: error,
    };
    next(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (!userExists) {
      res.status(400).json({ msg: "Invalid Credentials" });
    } else {
      if (userExists.isVerified === true) {
        const isMatch = await userExists.comparePassword(password);
        if (!isMatch) {
          res
            .status(401)
            .json({ msg: "Invalid email or password Credentials" });
        } else {
          if (userExists.status === false) {
            res
              .status(401)
              .json({ msg: "Your account is blocked please contact admin" });
          } else {
            res.status(200).json({
              msg: "login successful",
              token: await userExists.generateAuthToken(rememberMe),
            });
          }
        }
      } else {
        res.status(401).json({
          msg: "Please verify your Email Id",
          redirectedURL: "/otpVerfication",
        });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const otp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const validate = await Otp.findOne({ email: email.toLowerCase() });

    if (validate) {
      res.status(200).json({
        msg: "OTP already sent \nPlease check your email",
        redirected: true,
      });
    } else {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const findUser = await User.findOne({ email: email.toLowerCase() });
      const otpCreated = await Otp.create({
        email: email.toLowerCase(),
        otp: otp,
      });
      const mailSent = await sendMail(email, "user", findUser.firstName, otp);
      if (otpCreated && mailSent.accepted[0] === `${email}`) {
        res.status(200).json({
          msg: "OTP sent successfully",
          extraD: "Please check your email",
          redirected: true,
        });
      } else {
        res.status(400).json({ msg: "OTP generation failed" });
        Otp.deleteOne({ email: email.toLowerCase() });
      }
    }
  } catch (error) {
    err = {
      msg: "OTP generation failed",
      status: 500,
      extraD: error,
    };
    next(err);
  }
};

const validateOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  const io = req.io;
  try {
    const userExists = await Otp.findOne({ email: email.toLowerCase() });
    if (!userExists) {
      res
        .status(400)
        .json({ msg: "User not found \n Please Genrate your OTP" });
    } else {
      if (userExists.attempt === 3) {
        const curentDate = Date();
        const otpCreationDate = userExists.date;
        const timeDiff = timeDifference(otpCreationDate, curentDate);
        if (timeDiff) {
          await Otp.updateOne({ attempt: 0, date: Date() });
          res.status(201).json({
            msg: "Attempt reset successfully",
            extraD: "Please try again",
          });
        } else {
          res.status(400).json({
            msg: "OTP validation failed please try again after 1 hours",
          });
        }
      } else {
        if (userExists.otp === otp) {
          const deleted = await Otp.deleteOne({
            email: email.toLowerCase(),
          });
          if (deleted) {
            const verfiy = await User.updateOne(
              { email: email.toLowerCase() },
              { $set: { isVerified: true } }
            );
            if (verfiy) {
              let currentUTC = new Date();
              let currentIST = new Date(
                currentUTC.getTime() + 5.5 * 60 * 60 * 1000
              );
              const notification = {
                title: "Email Verified",
                description: `Your email is verified successfully`,
                date: currentIST,
              };
              userExists.notifications.push(notification);
              userExists.save();
              io.to(userExists._id).emit("newNotification", notification);
              res.status(200).json({
                msg: "OTP validation successful",
              });
            } else {
              res.status(400).json({
                msg: "OTP validation failed to uptade user Status please try again",
              });
            }
          } else {
            res
              .status(400)
              .json({ msg: "OTP validation failed/delete please try again" });
          }
        } else {
          const attempt = userExists.attempt + 1;
          const updateAttempt = await Otp.updateOne({ attempt: attempt });
          if (updateAttempt) {
            res.status(400).json({
              msg: "Invalid OTP validation failed please try again",
              extraD: `attempt left ${3 - attempt} out of 3`,
            });
          } else {
            res.status(400).json({
              msg: "validation failed please try again",
              extraD: "attempt update failed",
            });
          }
        }
      }
    }
  } catch (error) {
    err = {
      msg: "OTP validation failed",
      status: 500,
      extraD: error,
    };
    next(err);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (!userExists) {
      res.status(400).json({ msg: "User not found Please Register Yourself" });
    } else {
      if (userExists.isVerified) {
        if (otpForResetPass.get(email.toLowerCase())) {
          res.status(200).json({
            msg: "OTP already sent \nPlease check your email",
            redirected: true,
          });
        } else {
          const otp = Math.floor(1000 + Math.random() * 9000).toString();
          let time = new Date();
          otpForResetPass.set(email.toLowerCase(), {
            otp: otp,
            time: time,
            attempt: 0,
          });
          const mailSent = await sendMail(
            email,
            "reset",
            userExists.firstName,
            otp
          );
          if (mailSent.accepted[0] === `${email}`) {
            res.status(200).json({
              msg: "OTP sent successfully",
              extraD: "Please check your email",
              redirected: true,
            });
          } else {
            res.status(400).json({ msg: "OTP generation failed" });
            otpForResetPass.delete(email.toLowerCase());
          }
        }
      } else {
        res
          .status(400)
          .json({ msg: "Please verify your email or Reregister Yourself" });
      }
    }
  } catch (error) {}
};

const validatePassResetOTP = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const io = req.io;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(400).json({ msg: "User not found Please Register Yourself" });
    } else {
      const otpExists = otpForResetPass.get(email.toLowerCase());
      if (!otpExists) {
        res.status(400).json({ msg: "OTP expired Please Genrate new OTP" });
      } else {
        if (otpExists.attempt === 3) {
          const curentDate = new Date();
          const otpCreationDate = otpExists.time;
          const timeDiff = timeDifferenceForRestPass(
            otpCreationDate,
            curentDate
          );
          if (timeDiff) {
            otpForResetPass.set(email.toLowerCase(), {
              otp: otp,
              time: curentDate,
              attempt: 0,
            });
            res.status(201).json({
              msg: "Attempt reset successfully",
              extraD: "Please try again",
            });
          } else {
            res.status(400).json({
              msg: "OTP validation failed please try again after 1 hours",
            });
          }
        } else {
          if (otpExists.otp === otp) {
            otpForResetPass.delete(email.toLowerCase());
            await User.updateOne(
              { email: email.toLowerCase() },
              { $set: { password: await genrateNewPass(password) } }
            );
            let currentUTC = new Date();
            let currentIST = new Date(
              currentUTC.getTime() + 5.5 * 60 * 60 * 1000
            );
            const notification = {
              title: "Password Reset",
              description: `Your password is reset successfully`,
              date: currentIST,
            };
            user.notifications.push(notification);
            user.save();
            io.to(user._id).emit("newNotification", notification);
            res.status(200).json({ msg: "OTP validation successful" });
          } else {
            const attempt = otpExists.attempt + 1;
            otpExists.attempt = attempt;
            res.status(400).json({
              msg: "Invalid OTP validation failed please try again",
              extraD: `attempt left ${3 - attempt} out of 3`,
            });
          }
        }
      }
    }
  } catch (error) {
    err = {
      msg: "OTP validation failed",
      status: 500,
      extraD: error,
    };
    next(err);
  }
};

function timeDifference(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  const timeDifference = Math.abs(date2 - date1);
  if (timeDifference > 3600000) {
    return true;
  } else {
    return false;
  }
}
function timeDifferenceForRestPass(date1, date2) {
  const timeDifference = Math.abs(date2 - date1);
  if (timeDifference > 3600000) {
    return true;
  } else {
    return false;
  }
}

const genrateNewPass = async function (password) {
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, saltRound);
    return hash_password;
  } catch (error) {
    console.log(error);
  }
};

const loginWithSocialMedia = async (req, res) => {
  const { email, displayName, photoURL, phoneNumber } = req.body;
  const io = req.io;
  let userPhone = phoneNumber || "";
  try {
    if (email === undefined || email === null || email === "") {
      res
        .status(400)
        .json({ msg: "Email is not provided in your Social Media Account" });
    } else {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (!userExists) {
        const firstName = displayName.split(" ")[0];
        const lastName = displayName.split(" ")[1] || "";
        const password = Math.floor(
          10000000 + Math.random() * 90000000
        ).toString();
        const userCreated = await User.create({
          firstName: firstName,
          lastName: lastName,
          email: email.toLowerCase(),
          password: password,
          avatarURL: photoURL,
          phone: userPhone,
          isVerified: true,
        });
        let currentUTC = new Date();
        let currentIST = new Date(currentUTC.getTime() + 5.5 * 60 * 60 * 1000);
        const notification = {
          title: "Welcome to the community",
          description: `Thanks for joining this  community ${firstName} ${lastName}`,
          date: currentIST,
        };
        userCreated.notifications.push(notification);
        userCreated.save();
        io.to(userCreated._id).emit("newNotification", notification);
        const mailSent = await sendMail(email, "login", firstName, password);
        if (mailSent.accepted[0] === `${email}`) {
          res.status(201).json({
            msg: "Registation successful",
            token: await userCreated.generateAuthToken(),
          });
        } else {
          res.status(400).json({
            msg: "Registation Failed",
            extrD: "Failed to send mail please contact Administrator",
          });
          User.deleteOne({ email: email.toLowerCase() });
        }
      } else {
        if (userExists.isVerified === false) {
          await userExists.updateOne({
            isVerified: true,
            phone: userPhone,
            avatarURL: photoURL,
          });
          let currentUTC = new Date();
          let currentIST = new Date(
            currentUTC.getTime() + 5.5 * 60 * 60 * 1000
          );
          const notification = {
            title: "Email Verified",
            description: `Your email is verified successfully`,
            date: currentIST,
          };
          userExists.notifications.push(notification);
          userExists.save();
          io.to(userExists._id).emit("newNotification", notification);
        }
        if (userExists.status === false) {
          res
            .status(401)
            .json({ msg: "Your account is blocked please contact admin" });
        } else {
          res.status(200).json({
            msg: "login successful",
            token: await userExists.generateAuthToken(),
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

function generateAvatar() {
  const avatars = [
    "Avatar1",
    "Avatar2",
    "Avatar3",
    "Avatar4",
    "Avatar5",
    "Avatar6",
  ];
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
}
//storing otp for reset password
let otpForResetPass = new Map();

module.exports = {
  login,
  register,
  otp,
  validateOtp,
  forgotPassword,
  validatePassResetOTP,
  loginWithSocialMedia,
};
