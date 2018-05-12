/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Pendidikan =  sequelize.define('tb_pendidikan', {
    recid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pendidikan: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    kategori: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'tb_pendidikan',
    timestamps: false
  })

  const db = sequelize.models
  
  Pendidikan.get = async () => {
    const data = await db.tb_pendidikan.findAll({raw: true})
    return data
  }

  return Pendidikan
};
