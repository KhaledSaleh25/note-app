const validateRegister = (req, res, next) => {
  const { username, password, email } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Missing required fields (username, password, email)" });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }
  
  next();
};

const validateOTP = (req, res, next) => {
  const { username, otpCode } = req.body;
  
  if (!username || !otpCode) {
    return res.status(400).json({ message: "Missing username or OTP code" });
  }
  
  next();
};

const validateCategory = (req, res, next) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: "Name required" });
  }
  
  next();
};

const validateNote = (req, res, next) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }
  
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateOTP,
  validateCategory,
  validateNote
};