const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Post.init({
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    img: DataTypes.TEXT,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
