const awsS3 = require('../utils/awsS3');

const createUploadURL = async (req, res) => {
    try {
        const { key } = req.body;
        const data = await awsS3.generateUploadLink(key);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getViewURL = async (req, res) => {
    try {
        const { key } = req.body;
        const data = await awsS3.getFileUrl(key);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


module.exports = { createUploadURL, getViewURL };