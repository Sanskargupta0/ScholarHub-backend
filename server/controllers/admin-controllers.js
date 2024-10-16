const User = require("../models/User_model");

const getUsersData = async (req, res) => {
  try {
    const user = req.user;
    let { filterdata } = req.body;
    const { perPage = 10, page = 1 } = req.query;
    const perPageNo = Math.max(parseInt(perPage), 1);
    const pageNo = Math.max(parseInt(page), 1);

    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ msg: "Unauthorized HTTP, Admin access only" });
    }

    if (filterdata) {
      const name = filterdata.name || "";
      const email = filterdata.email || "";
      const rollNumber = filterdata.rollNumber || 0;
      const isAdmin = filterdata.role || false;
      const lastName = filterdata.lastName || "";
      const phone = filterdata.phone || "";

      const query = {
        ...(name && { firstName: { $regex: name, $options: "i" } }),
        ...(email && { email: { $regex: email, $options: "i" } }),
        ...(lastName && { lastName: { $regex: lastName, $options: "i" } }),
        ...(phone && { phone: { $regex: phone, $options: "i" } }),
      };
      if (rollNumber) {
        query.$expr = {
          $regexMatch: {
            input: { $toString: "$rollNumber" },
            regex: rollNumber.toString(),
          },
        };
      }
      if (isAdmin) {
        query.isAdmin = isAdmin;
      }

      const totalUsers = await User.countDocuments(query);

      if (totalUsers === 0) {
        return res.status(200).json({
          users: [],
          totalUsers: 0,
          msg: "No users found matching the filter criteria.",
        });
      }

      const maxPageNo = Math.ceil(totalUsers / perPageNo);
      const adjustedPageNo = Math.min(pageNo, maxPageNo);

      const users = await User.find(query)
        .select({ notifications: 0, bookmarks: 0 })
        .limit(perPageNo)
        .skip((adjustedPageNo - 1) * perPageNo);

      res.status(200).json({ users, totalUsers });
    } else {
      const totalUsers = await User.countDocuments();
      const maxPageNo = Math.ceil(totalUsers / perPageNo);
      const adjustedPageNo = Math.min(pageNo, maxPageNo);

      const users = await User.find()
        .select({ notifications: 0, bookmarks: 0 })
        .limit(perPageNo)
        .skip((adjustedPageNo - 1) * perPageNo);

      res.status(200).json({ users, totalUsers });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.body;

    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ msg: "Unauthorized HTTP, Admin access only" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(400).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const { id, updateData } = req.body;
    const io = req.io;

    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ msg: "Unauthorized HTTP, Admin access only" });
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(400).json({ msg: "User not found" });
    }

    for (let key in updateData) {
      if (key === "_id" || key === "notifications" || key === "bookmarks") {
        return res.status(400).json({ message: "You can't update this data" });
      }
      userToUpdate[key] = updateData[key];
    }

    let currentUTC = new Date();
    let currentIST = new Date(currentUTC.getTime() + 5.5 * 60 * 60 * 1000);
    if (updateData.status===false || updateData.status===true) {
      const notification = {
        title: "Account Status Updated",
        description: `Your account status has been updated by admin to ${
          updateData.status ? "Active" : "Inactive"
        }`,
        date: currentIST,
      };
      userToUpdate.notifications.push(notification);
      io.to(id).emit("newNotification", notification);
    } else {
      const notification = {
        title: "Profile Updated",
        description: `Your profile has been updated by admin and some changes have been made: ${Object.entries(
          updateData
        )
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")}`,
        date: currentIST,
      };
      userToUpdate.notifications.push(notification);
      io.to(id).emit("newNotification", notification);
    }
    const update = await userToUpdate.save();
    if (!update) {
      return res.status(400).json({ msg: "Failed to update user data" });
    } else {
      res.status(200).json({ msg: "User data updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { getUsersData, deleteUser, updateUser };
