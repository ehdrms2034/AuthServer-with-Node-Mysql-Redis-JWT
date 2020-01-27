
const path = require('path');
const Sequelize = require('sequelize');

const env = 'developmentSalt';
const config = require(path.join(__dirname,'..','..','config','config.json'))[env];
const db = {};

let sequelize = new Sequelize(config.database,config.username,config.password,config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Salt = require('./salt')(sequelize,Sequelize);

module.exports = db;
