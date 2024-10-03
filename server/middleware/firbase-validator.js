const admin = require('firebase-admin');

const firebaseValidator = async (req, res, next) => {
  try {
    const token = req.body.token;
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Token is valid, set user info on the request
    req.body = {
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
      phoneNumber: decodedToken.phone_number
    };

    next();
  } catch (error) {
    const err = {
      status: 401,
      msg: "Unauthorized",
      extraD: error.message || "Invalid token",
    };
    next(err);
  }
};

module.exports = firebaseValidator;