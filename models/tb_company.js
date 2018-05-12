/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_company', {
    recid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    alamat: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    hp: {
      type: DataTypes.STRING(13),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'tb_company',
    timestamps: false
  });
};
