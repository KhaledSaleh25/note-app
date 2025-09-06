const Session = require('../models/Session');

const auth = async (req, res, next) => {
  try {
    const token = req.header('token');
    
    if (!token) {
      return res.status(200).json({ message: "Not Authenticated" });
    }
    
    const session = await Session.findOne({ token });
    
    if (!session) {
      return res.status(200).json({ message: "Not Authenticated" });
    }
    
    req.user = {
      username: session.username,
      role: session.role
    };
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = auth;