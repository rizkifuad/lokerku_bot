/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Jurusan =  sequelize.define('tb_jurusan', {
    recid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    kategori: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    jurusan: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    tableName: 'tb_jurusan',
    timestamps: false
  });

  const db = sequelize.models

  Jurusan.get = async () => {
    return await db.tb_jurusan.findAll({})
  }

  return Jurusan
};
