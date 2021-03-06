'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'production';
const config = require(`${__dirname}/../config/config.json`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.tests = require('./tests')(sequelize, Sequelize);
db.users = require('./users')(sequelize, Sequelize);
db.tourArea = require('./tour-area')(sequelize, Sequelize);
db.tourContent = require('./tour-content')(sequelize, Sequelize);
db.tourCategory = require('./tour-category')(sequelize, Sequelize);
db.citys = require('./citys')(sequelize, Sequelize);
db.places = require('./places')(sequelize, Sequelize);

db.users.belongsTo(db.tests, { foreignKey: 'test_idx' });
db.users.belongsTo(db.users, { foreignKey: 'id' });
db.citys.belongsTo(db.tourArea, { foreignKey: 'area_index' });

module.exports = db;
