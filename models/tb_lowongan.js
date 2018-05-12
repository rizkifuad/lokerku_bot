/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Lowongan = sequelize.define('tb_lowongan', {
    recid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    company: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    posisi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    keterangan: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    min_usia: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    max_usia: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pendidikan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    jurusan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nilai: {
      type: "DOUBLE",
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'tb_lowongan',
    timestamps: false
  });

  const db =  sequelize.models

  Lowongan.get = async(chat_id) => {
    const user = await db.tb_user.findOne({
      where: {
        chat_id
      },
      raw:true
    })

    console.log(user)

    const lowongan = await db.tb_lowongan.findAll({raw: true})
    console.log(lowongan)
    console.log(lowongan)

    let loker = []
    for (let d of lowongan) {
      
      d.mpendidikan = d.pendidikan.split(',')
      d.mjurusan = d.jurusan.split(',')

      console.log(d.mpendidikan)
      console.log(d.mjurusan)

      console.log(d.mpendidikan.indexOf(user.pendidikan+''))

      if (d.mpendidikan.indexOf(user.pendidikan+'') != -1 && d.mjurusan.indexOf(user.jurusan+'') != -1) {
        console.log('true')
        loker.push(d)
      } 

    }

    console.log(loker)

    return loker


  }

  Lowongan.detail = async(recid) => {
    const lowongan = await db.tb_lowongan.findOne({
      where: {recid},
      raw: true
    })

    const mpendidikan = lowongan.pendidikan.split(',')
    const mjurusan = lowongan.jurusan.split(',')

    const tpendidikan = await db.tb_pendidikan.findAll({
      attributes: ['pendidikan'],
      where: {
        recid: mpendidikan
      },
      raw: true
    })

    const tjurusan = await db.tb_jurusan.findAll({
      attributes: ['jurusan'],
      where: {
        recid: mpendidikan
      },
      raw: true
    })

    let pendidikan = []
    let jurusan = []
    for (let p of tpendidikan) {
      pendidikan.push(p.pendidikan)
    }

    for (let p of tjurusan) {
      jurusan.push(p.jurusan)
    }

    return {pendidikan, jurusan}

  }

  return Lowongan
};
