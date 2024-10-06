const User = require("../models/User_model");

const getUsersData = async (req, res) => {
    try {
      const user = req.user;
      let { filterdata } = req.body;
      const { perPage = 10, page = 1, resetFilters } = req.query;
      const perPageNo = Math.max(parseInt(perPage), 1);
      const pageNo = Math.max(parseInt(page), 1);
  
      if (!user.isAdmin) {
        return res
          .status(401)
          .json({ msg: "Unauthorized HTTP, Admin access only" });
      }
  
      // Handle resetting filters
      if (resetFilters) {
        req.session.filterdata = null;
        filterdata = null;
      }
  
      // If no filter data is passed in the body, use session-stored data
      if (!filterdata && req.session.filterdata) {
        filterdata = req.session.filterdata;
      }
  
      if (filterdata) {
        // Store filter data in the session for future requests
        req.session.filterdata = filterdata;
  
        const name = filterdata.name || "";
        const email = filterdata.email || "";
        const isAdmin = filterdata.isAdmin || "";
        const rollNumber = filterdata.rollNumber || "";
  
        const query = {
          ...(name && { name: { $regex: name, $options: "i" } }),
          ...(email && { email: { $regex: email, $options: "i" } }),
          ...(isAdmin && { isAdmin: { $regex: isAdmin, $options: "i" } }),
          ...(rollNumber && { rollNumber: { $regex: rollNumber, $options: "i" } }),
        };
  
        const totalUsers = await User.countDocuments(query);
        const maxPageNo = Math.ceil(totalUsers / perPageNo);
        const adjustedPageNo = Math.min(pageNo, maxPageNo);
  
        const users = await User.find(query)
          .select({ notifications: 0, bookmarks: 0 })
          .limit(perPageNo)
          .skip((adjustedPageNo - 1) * perPageNo);
  
        res.status(200).json(users);
      } else {
        const totalUsers = await User.countDocuments();
        const maxPageNo = Math.ceil(totalUsers / perPageNo);
        const adjustedPageNo = Math.min(pageNo, maxPageNo);
  
        const users = await User.find()
          .select({ notifications: 0, bookmarks: 0 })
          .limit(perPageNo)
          .skip((adjustedPageNo - 1) * perPageNo);
  
        res.status(200).json(users);
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
