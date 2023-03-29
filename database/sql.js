const fs = require('fs');
const path = require('path')

module.exports = {
  sequelize: async (sequelizePackage, databaseConfig, type) => {
    let sequelize;
    if (databaseConfig) {
      sequelize = new sequelizePackage.Sequelize(
        databaseConfig.database,
        databaseConfig.username,
        databaseConfig.password,
        {
          // ...databaseConfig,
          logging: databaseConfig.logging,
          host: databaseConfig.host,
          admin: databaseConfig.admin,
          port: databaseConfig.port,
          dialect: type
        }
      );
      let retries = 10;
      while (retries > 0) {
        try {
          await sequelize.authenticate();
          if (databaseConfig?.entities && databaseConfig?.entities?.length > 0) {
            databaseConfig.entities.forEach((entity) => {
              let modelsPath = process.cwd() + entity
              fs.readdirSync(modelsPath)
                .filter((file) => file.endsWith('.js'))
                .forEach((file) => {
                  const model = require(path.join(modelsPath, file))(
                    {
                      sequelize,
                      DataTypes: sequelizePackage.DataTypes,
                      Model: sequelizePackage.Model,
                    });
                  sequelize.models[model.name] = model;
                })
            });
          }
          console.log('\x1b[1m\x1b[32m%s\x1b[0m', "Connected to database");
          return { sequelize, DataTypes: sequelizePackage.DataTypes, Model: sequelizePackage.Model }
        } catch (error) {
          console.log(`Failed to connect to database. ${retries} retries left.`);
          retries--;
          if (retries === 0) {
            return {
              message: `Failed to connect to database. ${error.message}`
            }
          }
          await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds before retrying
        }
      }
    }
  }
}
