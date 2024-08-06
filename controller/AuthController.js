const db = require("../models/index");
const User = db.Users;
const Book = db.Books;
const BookIssue = db.BookIssue;
const bcrypt = require("bcrypt");
const secretKey = "Dhrujal";
const jwt = require("jsonwebtoken");
const transporter = require("../helper/nodemailer");
const { Op } = require("sequelize");

module.exports.signup_post = async (req, res) => {
  try {
    const { firstName, lastName, birthdate, email, phone, password, type } =
      req.body;

    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ msg: "Email is already registered" });
    }

    const HashPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, secretKey, { expiresIn: "1d" });
    //crreate new user
    const newUser = await User.create({
      firstName,
      lastName,
      birthdate,
      email,
      phone,
      password: HashPassword,
      verification_token: token,
      type,
    });
    const mailOptions = {
      from: "db7f2fa3cd9ad2",
      to: email,
      subject: "Email Verification",
      html: `<p>Click on the following link to verify your email: <a href="http://localhost:8080/api/verify_email/${token}">Verify Email</a></p>`,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ msg: "Error sending verification email." });
      } else {
        return res.status(201).json({
          msg: "Registration successful. Please check your email for verification.",
        });
      }
    });
    console.log("newUser --->", newUser);
    res.status(200).json({ status: "User Registration SuccessFully !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server side signUp in error" });
  }
};

module.exports.verify_email = async (req, res) => {
  try {
    const { token } = req?.params;
    console.log("✌️ token --->", token);
    if (!token) {
      return res.status(400).json({ msg: "Token is required" });
    }
    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }
    user.isverified = true;

    const decodedEmail = jwt.verify(token, secretKey);
    res.cookie("librarian", decodedEmail.email);

    await user.save();
    return res.json({ status: "Email Verification Successfully..." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server side verify_email in error" });
  }
};

module.exports.login_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(500).json({ msg: "Password didn't match" });
    }
    const SignIntoken = await jwt.sign(
      { id: user.id, email: user.name },
      secretKey,
      { expiresIn: "1d" }
    );
    return res
      .status(200)
      .json({ msg: "User Logged In Successfully", SignIntoken: SignIntoken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server side login in error" });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const findMail = await User.findOne({
      where: { email: req.body.email },
    });
    if (!findMail) {
      return res.status(400).json({ msg: "User not found" });
    } else {
      const token = jwt.sign({ id: findMail.id }, secretKey, {
        expiresIn: "1d",
      });
      findMail.forgotPasswordToken = token;
      findMail.save();

      const mailOptions = {
        from: "db7f2fa3cd9ad2",
        to: req.body.email,
        subject: "Reset Password",
        html: `<p>Click on the following link to reset your password: <a href="http://localhost:8080/api/resetpassword/${token}">Reset Password</a></p>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ msg: "Error sending verification email." });
        } else {
          return res.status(201).json({
            msg: "Registration successful. Please check your email for verification.",
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token; // Get token from URL parameters
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, secretKey); // Verify the token
    const userId = decoded.id;

    const findUser = await User.findOne({ where: { id: userId } });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "New password is missing" });
    }

    findUser.password = await bcrypt.hash(newPassword, 10);
    await findUser.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "curunt and new password required" });
    }
    const findUser = await User.findOne({ where: { id: req.params.id } });
    if (!findUser) {
      return res.status(404).json({ msg: "Invalid User" });
    }
    const passwordValid = await bcrypt.compare(
      currentPassword,
      findUser.password
    );
    if (!passwordValid) {
      return res.status(404).json({ msg: "currunt password is not match" });
    }
    const HashPassword = bcrypt.hashSync(newPassword, 10);
    findUser.password = HashPassword;

    await findUser.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.StudentDetails = async (req, res) => {
  try {
    const data = await User.findOne({
      where: { id: 1 },
      attributes: ["firstName", "lastName"],
      include: [
        {
          model: Book,
          attributes: ["bookName", "sem"],
        },
        {
          model: BookIssue,
          attributes: ["issuedate", "submitiondate"],
        },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.Search = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      bookName = "",
      issuedate = "",
      submitiondate = "",
    } = req.body;
    console.log("✌️ req.body --->", req.body);

    const formattedIssuedate = issuedate
      ? moment(issuedate).toISOString()
      : null;
    const formattedSubmitiondate = submitiondate
      ? moment(submitiondate).toISOString()
      : null;

    const userConditions = [];
    const bookConditions = [];
    const bookIssueConditions = [];

    if (firstName) {
      userConditions.push({ firstName: { [Op.like]: `%${firstName}%` } });
    }
    if (lastName) {
      userConditions.push({ lastName: { [Op.like]: `%${lastName}%` } });
    }
    if (bookName) {
      bookConditions.push({ bookName: { [Op.like]: `%${bookName}%` } });
    }
    if (formattedIssuedate) {
      bookIssueConditions.push({ issuedate: { [Op.eq]: formattedIssuedate } });
    }
    if (formattedSubmitiondate) {
      bookIssueConditions.push({
        submitiondate: { [Op.eq]: formattedSubmitiondate },
      });
    }

    const users = await User.findAll({
      where: userConditions.length > 0 ? { [Op.and]: bookConditions } : {},
      include: [
        {
          model: Book,
          where: bookConditions.length > 0 ? { [Op.and]: bookConditions } : {},
          required: bookConditions.length > 0,
          include: [
            {
              model: BookIssue,
              where:
                bookIssueConditions.length > 0
                  ? { [Op.and]: bookIssueConditions }
                  : {},
              required: bookIssueConditions.length > 0,
            },
          ],
        },
      ],
    });
    return res.json({ msg: "ok", users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
