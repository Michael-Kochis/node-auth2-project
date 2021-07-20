const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../secrets"); // use this secret!
const users = require('../users/users-model');

const restricted = (req, res, next) => {
  /*
    If the user does not provide a token in the Authorization header:
    status 401
    {
      "message": "Token required"
    }

    If the provided token does not verify:
    status 401
    {
      "message": "Token invalid"
    }

    Put the decoded token in the req object, to make life easier for middlewares downstream!
  */
 const token = req.headers.authorization;

 if (!token) {
   res.status(401).json({ message: "Token required" });
 }
 jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
   if (err) {
     res.status(401).json({ message: "Token invalid" });
   } else {
     req.decodedJWT = decodedToken;
     next();
   }
 })
}

const only = role_name => (req, res, next) => {
  /*
    If the user does not provide a token in the Authorization header with a role_name
    inside its payload matching the role_name passed to this function as its argument:
    status 403
    {
      "message": "This is not for you"
    }

    Pull the decoded token from the req object, to avoid verifying it again!
  */
  const token = req.decodedJWT;

  if (!token || token.role_name !== role_name) {
    res.status(403).json({ 
      actual: token.role_name,
      expected: role_name,
      message: "This is not for you",
      token: req.decodedJWT 
    });
  } else {
    next();
  }
}


const checkUsernameExists = async (req, res, next) => {
  /*
    If the username in req.body does NOT exist in the database
    status 401
    {
      "message": "Invalid credentials"
    }
  */
 const { username } = req.body;
 const found = await users.findBy({ username: username });

 if (!found) {
  res.status(401).json({ message: "Invalid credentials" });
 } else {
   req.user = found[0];
   next();
 }
}


const validateRoleName = (req, res, next) => {
  /*
    If the role_name in the body is valid, set req.role_name to be the trimmed string and proceed.

    If role_name is missing from req.body, or if after trimming it is just an empty string,
    set req.role_name to be 'student' and allow the request to proceed.

    If role_name is 'admin' after trimming the string:
    status 422
    {
      "message": "Role name can not be admin"
    }

    If role_name is over 32 characters after trimming the string:
    status 422
    {
      "message": "Role name can not be longer than 32 chars"
    }
  */
  let { role_name } = req.body; 

  if (!role_name || typeof(role_name) !== "string" ) {
    role_name = "student";
  } else {
    role_name = role_name.trim();
    if (role_name === "") {
      role_name = "student";
    } else if (role_name === "admin") {
      res.status(422).json({ message: "Role name cannot be admin"})
    } else if (role_name.length > 32) {
      res.status(422).json({ 
        message: "Role name cannot be more than 32 characters"
      });
    }  
  }
  req.body.role_name = role_name;
  next();
}

module.exports = {
  restricted,
  checkUsernameExists,
  validateRoleName,
  only,
}
