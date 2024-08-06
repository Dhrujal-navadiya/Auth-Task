const db = require("../models/index");
const BookIssue = db.BookIssue;

module.exports.BooksIssueCreate = async (req, res) => {
  try {
    const { bookid, userId, issuedate, submitiondate } = req.body;
    const newBook = await BookIssue.create({
      bookid,
      userId,
      issuedate,
      submitiondate,
    });
    return res.json({ newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
