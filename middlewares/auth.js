const jwt = require("jsonwebtoken");
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user.user;
    next();
  });
};

exports.authenticateTokenAdmin = (req, res, next) => {
  exports.authenticateToken(req, res, () => {
    if (req.user.is_admin) {
      next();
    } else {
      res.sendStatus(403);
    }
  });
};
