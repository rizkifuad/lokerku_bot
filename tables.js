var SequelizeAuto = require('sequelize-auto')
var dotenv = require('dotenv')
dotenv.load()

var table = process.argv[2]

var auto = new SequelizeAuto(process.env.MYSQL_DBNAME, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    pass: process.env.MYSQL_PASSWORD,
    dialect: 'mysql',
    spaces: true,
    indentation: 2,
    additional: {
        timestamps: false
    },
    tables: [table],

})

auto.run(function (err) {
  if (err) throw err;

  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
});

