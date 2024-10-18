const User = require("../models/User_model");
const Gobal_NotificationModel = require("../models/Gobal_Notification");

const createGobalNotification = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = req.user;
    const io = req.io;

    if (user.isAdmin === false) {
      return res
        .status(400)
        .json({ msg: "You are not authorized to create notification" });
    }
    let currentUTC = new Date();
    let currentIST = new Date(currentUTC.getTime() + 5.5 * 60 * 60 * 1000);
    const notification = { title, description, date: currentIST };
    const globalNotification = new Gobal_NotificationModel({ title, description });
    await globalNotification.save();
    io.emit("newGlobalNotification", notification);
    res.status(201).json({ msg: "Notification created successfully", notification });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getGobalNotification = async (req, res) => {
  try {
    const userData = req.user;
    if (userData) {
      const notifications = await Gobal_NotificationModel.find();
      res.status(200).json(notifications);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getUserSpecificNotification = async (req, res) => {
  try{
    const userData = req.user;
    const { id } = req.body;
    if(userData.isAdmin===false){
      res.status(400).json({msg:"You are not authorized to get user specific notification"});
    }else{
      const notifications = await User.findById(id).select("notifications");
      res.status(200).json(notifications);
    }

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const user = req.user;
    const io = req.io;
    if (user.isAdmin === false) {
      return res
        .status(400)
        .json({ msg: "You are not authorized to send notification" });
    }
    let currentUTC = new Date();
    let currentIST = new Date(currentUTC.getTime() + 5.5 * 60 * 60 * 1000);
    const notification = { title, description, date: currentIST };
    const UserData = await User.findById(userId);
    UserData.notifications.push(notification);
    await UserData.save();
    io.to(userId).emit("newNotification", notification);
    res.status(200).json({ msg: "Notification sent successfully", notification });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createGobalNotification,
  getGobalNotification,
  getUserSpecificNotification,
  sendNotification
};
