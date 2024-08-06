const db = require("../models/index");
const Book = db.Books;
const User = db.Users;

module.exports.bookCreate = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    const createdBook = await Book.findOne({
      where: { id: book.id },
    });

    res.status(200).json(createdBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: {
        model: User,
        attributes: ["firstName", "lastName", "email", "phone"],
      },
    });

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
