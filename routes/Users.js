const express = require("express");
const router = express.Router();

const authControllers = require("../controller/AuthController");
const BookController = require("../controller/BookController");
const BookIssueController = require("../controller/BookIssueController");
const AuthMiddle = require("../middleware/Auth");

// Auth
router.post("/signup", authControllers.signup_post);
router.post("/login", AuthMiddle.AuthMiddleware, authControllers.login_post);
router.get("/verify_email/:token", authControllers.verify_email);
router.post("/forgotPassword", authControllers.forgotPassword);
router.post("/resetpassword/:token", authControllers.resetPassword);
router.post("/changedpassword/:id", authControllers.changePassword);

// details
router.get("/studentData/:id", authControllers.StudentDetails);
router.get("/serach", authControllers.Search);

// Book
router.post("/create", BookController.bookCreate);
router.get("/get", BookController.getBooks);

// Book Issue
router.post("/createBookIssue", BookIssueController.BooksIssueCreate);

module.exports = router;
