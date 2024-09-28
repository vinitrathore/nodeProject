import con from "../utils/mysqlDb.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookie  from "cookie-parser";
const userRegisterM = (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check for missing or empty fields
  if (!name || name.trim() === "") {
    return res.status(500).json({ message: "Name is required." });
  }
  if (!email || email.trim() === "") {
    return res.status(500).json({ message: "Email is required." });
  }
  if (!password || password.trim() === "") {
    return res.status(500).json({ message: "Password is required." });
  }
  // if (!role || role.trim() === "") {
  //   return res.status(500).json({ message: "Role is required." });
  // }

  // Define the expected keys
  const expectedKeys = ["name", "email", "password"];

  // Get the actual keys from req.body
  const actualKeys = Object.keys(req.body);

  // Check if actual keys match the expected keys
  const keysMatch = expectedKeys.every((key) => actualKeys.includes(key));

  if (!keysMatch) {
    return res
      .status(500)
      .json({ message: "Keys are different from expected" });
  }
  const q = `SELECT * FROM user WHERE email =?`;
  con.query(q, [email], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      next();
    } else {
      res.send("user already exists.");
    }
  });
};
const userLoginM = (req, res, next) => {
  const { email, password } = req.body;

  const expectedKeys = ["email", "password"];

  // Get the actual keys from req.body
  const actualKeys = Object.keys(req.body);

  // Check if actual keys match the expected keys
  const keysMatch = expectedKeys.every((key) => actualKeys.includes(key));

  if (!keysMatch) {
    return res
      .status(500)
      .json({ message: "Keys are different from expected" });
  }
  const q = `SELECT * FROM user WHERE email =?`;
  con.query(q, [email], (err, result) => {
    if (err) {
      console.log("error in login route=>", err);
    }

    if (result.length === 0) {
      res.send("please signup before login");
    } else {
      const user = result[0];
      bcrypt.compare(password, user.password, (err, isempty) => {
        if (err) {
          res.status(500).json({ message: "Illigal arguments" });
        }
        if (isempty) {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
          });
          res.send({
            success: true,
            message: "Login successfully",
            user,
            token,
          });
        } else {
          res.status(401).send("Invalid email or password.");
        }
      });
    }
  });
};

export { userRegisterM, userLoginM };
