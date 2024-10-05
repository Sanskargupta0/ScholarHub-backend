const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let Gobal_Notification = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: function() {
      let currentUTC = new Date();
      let currentIST = new Date(currentUTC.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5 hours and 30 minutes
      return currentIST;
    },
  },
});

const Gobal_NotificationModel =  new mongoose.model("Gobal_Notification", Gobal_Notification);

module.exports = Gobal_NotificationModel;
