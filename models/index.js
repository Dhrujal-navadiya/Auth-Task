const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("school", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./StudentsModel")(sequelize, DataTypes);
db.Books = require("./Book")(sequelize, DataTypes);
db.BookIssue = require("./BookIssue")(sequelize, DataTypes);

db.Users.hasMany(db.Books, { foreignKey: "userId" });
db.Books.belongsTo(db.Users, { foreignKey: "userId" });

db.Books.hasMany(db.BookIssue, { foreignKey: "bookid" });
db.BookIssue.belongsTo(db.Books, { foreignKey: "bookid" });

db.Users.hasMany(db.BookIssue, { foreignKey: "userId" });
db.BookIssue.belongsTo(db.Users, { foreignKey: "userId" });

db.sequelize.sync({ force: false, match: /school$/ }).then(() => {
  console.log("Database is synced");
});

module.exports = db; // Ensure you export the db object
