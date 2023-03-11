 
const fs = require('fs');
const path = require('path')
module.exports = {

  sequelize: async(sequelizePackage,databaseConfig,type)=>{
let sequelize;
    if (databaseConfig){
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
      try{
         await sequelize.authenticate()
         if(databaseConfig?.entities && databaseConfig?.entities?.length>0){
          databaseConfig.entities.forEach((entity)=>{
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
        console.log('\x1b[1m\x1b[32m%s\x1b[0m',"Connected to database");
     return { sequelize,DataTypes:sequelizePackage.DataTypes,Model: sequelizePackage.Model}
      }catch(error){
        // throw
        return {
          message :`database not connected. ${error.message}`
        }
      }
    }
    }
    
}
 