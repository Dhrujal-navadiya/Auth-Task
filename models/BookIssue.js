const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  const BookIssue = sequelize.define(
    "bookIssues",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bookid: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      issuedate: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue("issuedate")).format("YYYY-MM-DD");
        },
      },
      submitiondate: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue("submitiondate")).format(
            "YYYY-MM-DD"
          );
        },
      },
    },
    {
      timestamps: false,
    }
  );
  return BookIssue;
};
