/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('tb_user', {
    recid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pin: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    alamat: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    hp: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    pendidikan: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    jurusan: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    institusi: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nilai: {
      type: "DOUBLE",
      allowNull: true
    },
    pengalaman: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    perusahaan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    posisi: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    durasi: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    chat_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    registration_phase: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    skill: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'tb_user',
    timestamps: false
  });

  const db = sequelize.models

  User.getRegistrationPhase = async (chat_id) => {
    const user = await db.tb_user.findOne({
      where: {chat_id},
      raw: true
    })

    if (user) {
      return user.registration_phase
    }

    return null
  }

  User.updateRegistrationPhase = async (chat_id, registration_phase) => {
    await db.tb_user.updateRegistrationPhase({
      registration_phase
    })
  }

  User.register = async ({chat}) => {
    console.log(chat)
    const exist = await db.tb_user.findOne({
      where: {chat_id: chat.id}
    })

    if (!exist) {
      await db.tb_user.create({
        nama: chat.first_name + ' ' + chat.last_name,
        chat_id: chat.id,
        registration_phase: 'name'
      })
    }

  }
  return User
};
