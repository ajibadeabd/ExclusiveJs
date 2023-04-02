const express = require('express') 
const fs = require('fs');
const path = require('path'); 
const app = express()
const noSql = require("./database/noSql")
const sql = require("./database/sql")
const { MicroServiceServer } = require("./microservices/server")
class  ExclusiveJs {
 static #sequelize
 static #setDatabaseArgs
 static #databaseConnection
 static #routes
 static #microServiceConfig
 static #clientMicroServiceConfig 
 static #clientMicroService
  static instance = () => {
    if (this.newInstance) return this
    this.routePath = "src/routes";
    this.dirname = process.cwd() + "/";
    this.debug = true;
    this.microServices = {}
    this.apiPrefix = "api";
    this.packages = this.#injectPackages()
    this.validator = {}
    this.#routes = []
    this.#microServiceConfig = []
    this.#clientMicroServiceConfig = []
    this.#sequelize= {}
    this.databaseConnection= false
    this.#setDatabaseArgs = {}
    this.supportedDatabase = {
      mongodb:"mongodb",
      postgres:"postgres",
      mysql:"mysql"
    }
    this.supportedOrm = { 
      mongoose:"mongoose",
      sequelize:"sequelize",
    }
    this.injectedPackages = {}
    this.port = process.env.PORT  || "1234"
    this.app = null
    this.server = null
    this.newInstance = this.newInstance ? this.newInstance : new this();
    return this;
  };
  

  static setConfig = (config) => {
     this.packages?.dotenv?.config()
    return this;
  };
  static setDebugger = (debug) => {
    this.debug = debug;
    return this;
  };
  static setPort = (port) => {
    this.port = port
    return this;
  };
  static injectDatabase = (args) => {
    this.databaseConnection = !this.databaseConnection 
    this.setDatabaseArgs=args
    if(this.databaseConnection ){
      let database =  this.#injectDatabase(this.setDatabaseArgs)
      database.then(database=>{

    if(database?.error){
      console.log('\x1b[1m\x1b[31m%s\x1b[0m', database.error)
        return
    }
      })
    } 
    return this;
  }
  static setMicroservicesServerConfig = (microServiceConfig)=>{
    this.#microServiceConfig = microServiceConfig;
    return this
  }
  static setMicroservicesClientConfig = (clientMicroServiceConfig)=>{
    this.#clientMicroServiceConfig = clientMicroServiceConfig;
    return this
  }
  static listenClientMicroservices = async ()=>{
    if(this.#clientMicroServiceConfig?.length>0){
    }
    return this
  }
  static startServerMicroservices = async ()=>{
    if(this.#microServiceConfig?.length>0){
       this.microServiceServer = await  MicroServiceServer.setServerConfig(this.#microServiceConfig).init()
    }
    return this
  }
    static #injectDatabase = async(args) => {
    try {
    if (typeof args !== "object"){
      throw  "invalid parameter supplied"
    }
    if(!this.supportedDatabase[args.type.toLowerCase()]){
      throw `Unsupported database. Supported database types are: ${Object.values(this.supportedDatabase).join(', ')}`

    }
    if(args?.type?.toLowerCase()=== this.supportedDatabase.mongodb && args?.databaseUrl){

      if(args?.orm?.toLowerCase()===this.supportedOrm.mongoose){
        let data = await noSql[args?.orm?.toLowerCase()](this.packages.mongoose,args?.databaseUrl)
        if(data.message){
          throw data.message
         }
      }else{
      throw `Exclusivejs only support mongoose  for ${args?.type}`

      }
    }else if(args?.type?.toLowerCase() === this.supportedDatabase.mysql){
      if(args?.orm?.toLowerCase() === this.supportedOrm.sequelize){
       let data = await sql[args?.orm?.toLowerCase()](this.packages?.sequelize,args?.databaseConfig,args?.type?.toLowerCase())
       if(data.message){
        throw data.message
       } 
       this.#sequelize = data
       if(args.databaseConfig.synchronize){
        console.log('\x1b[1m\x1b[32m%s\x1b[0m',"database syncing ...");
      await  this.syncDatabase()
       }
        } else{
        throw `Exclusivejs only support sequelize  for ${args?.type}`
       
      }
    }  else if(args?.type?.toLowerCase() === this.supportedDatabase.postgres  && args?.databaseConfig){
    }
    else {
      throw `error in connection please check again`
    }
  }catch(error){
 
    return {
      error
    }
  }

  };

  static compile = (validator) => {

  }
    static setValidator = (validator) => {
    this.validator =  validator
    if(this.debug){
      console.log("validation in use")
    }
    return this;
  };

  static  #injectPackages = () => {
    // only compile package your installed not inbuilt package
    const  packageJson =  fs.readFileSync("./package.json", "utf8");

    // Parse contents as JSON object
    const packageObject = JSON.parse(packageJson);
    let allPackages = {}

    for (let eachPackages in packageObject.dependencies) {
      try{
        allPackages[eachPackages] = require(eachPackages)

      }catch(error){
        console.log('\x1b[1m\x1b[31m%s\x1b[0m',` ${Object.values(error)?.[0]}  please install ${eachPackages}`)

      }
    }
   // console.log(allPackages)
    return allPackages;
  };

  static setRoutePath = (path) => {
    this.routePath = path;
    return this;
  };

  static setApiPrefix = (apiPrefix) => {
    this.apiPrefix = apiPrefix;
    return this;
  };

  
  static #injectableModelFunction = (injectableModel)=>{
    return injectableModel.reduce((initialValue,currentModels)=>{
         initialValue[currentModels.modelName] = currentModels
          return initialValue
        },{})
    }
    static #injectableRepositoryFunction = (injectableModel)=>{
      return injectableModel.reduce((initialValue,currentRepository)=>{
          let repository = currentRepository({...this.#sequelize,packages:this.packages})
          initialValue[repository.name] = repository
            return initialValue
          },{})
      }
  static sortFile = (directory) => {
    return fs.readdirSync(directory).sort((a, b) => {
      if (a && b) {
        const aHasBrackets = a.includes("[") && a.includes("]");
        const bHasBrackets = b.includes("[") && b.includes("]");
        if (aHasBrackets && !bHasBrackets) {
          return 1;
        } else if (!aHasBrackets && bHasBrackets) {
          return -1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });
  };

  static setMiddleware = (middleware) => {
    let appInstance = app || this.app
    middleware(appInstance)
    return this;
  };
  static init = async() => {
    this.port = process.env.PORT || this.port
    await this.#initialize()
    return this
  }
    static setAppProvider = (appProvider) => {
      this.app = appProvider;
    }
      static #initialize = async() => {
    this.app = this.app ? this.app : app;

    let createRoute = async (directory, prefix) => {
      this.sortFile(directory).forEach((file) => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
          return createRoute(filePath, prefix + "/" + file.replace("]", "").replace("[", ":"));
        } else if (this.validateFile(file)) {
          const eachFile = require(filePath)
          let route = file.split(".")[0]
            .replace("index", "")
            .replace(/\s+/g, "");
            if(route ) route ="/" +route
            let injectableClasses = {}
            let injectableModels = {}
            const  injectableClass = eachFile['injectableClass']
            const  injectableModel = eachFile['injectableModel']
            const  injectableRepository = eachFile['injectableRepository']
            let allInjectableRepository = {}
            if(injectableRepository){
              allInjectableRepository = injectableRepository.reduce((initialValue,currentRepository)=>{
                // console.log(this.#sequelize)
                let repository =currentRepository({...this.#sequelize,packages:this.packages})
                initialValue[repository.name] = repository
                return initialValue
              },{})

            }
            const injectableFunction = (injectableClass)=>{
            return injectableClass.reduce((initialValue,currentClass)=>{

                let innerClass = {}
                let innerModel = {}
                let innerRepository = { }
                if(currentClass?.injectableClass?.length>0){
                  innerClass =  injectableFunction(currentClass?.injectableClass)
                }
                if(currentClass.circularDependencies){
                  
                 let resolvedDependency = this.#resolverCircularDependency(currentClass.circularDependencies[0]())
                 this.injectedPackages = resolvedDependency
                }
                
                if(currentClass.injectableModel?.length>0){
                  innerModel = this.#injectableModelFunction(currentClass.injectableModel)
                }
                if(currentClass.injectableRepository?.length>0){
                  innerRepository  = this.#injectableRepositoryFunction(currentClass.injectableRepository)
                }
                
                if(currentClass.class){

                const newClass = new currentClass.class(
                  {
                    packages: this.packages,
                    ...this.validator ,
                     models: innerModel,
                     repositories: innerRepository,
                     services:{...innerClass,...this.injectedPackages}
                  })
                  initialValue[currentClass.class.name] = newClass
                }
                  return initialValue
                },{})
            }
             
          if(injectableClass){

            injectableClasses = injectableFunction(injectableClass)
          }
          if(injectableModel){
            injectableModels = this.#injectableModelFunction(injectableModel)


          }

          if(eachFile["route"]){
            const routeClass = new eachFile["route"]( {
                    packages: this.packages ,
                    ...this.validator ,
                    repositories: allInjectableRepository,
                    models:  injectableModels, 
                    services: {...injectableClasses,  },
                  })
          for (const eachRoute in routeClass) {
            
            let [method, endpoint] = eachRoute.split(".");
            if(method==="event" || method==="message"){
              console.log(`${method} ${endpoint} registered`)
              console.log("------------------------------------------------")
                this.microServiceServer[method]("tcp", endpoint,routeClass[`${method}.${endpoint}`])
              continue 
            }
            
            if(endpoint){
            endpoint = "/"+endpoint
            }
            if(!["post","get","delete","put","patch"].includes(method)){
              
              let[ methodParams, param] = method.split(":")
              if(param && ["post","get","delete","put","patch"].includes(methodParams)){
                endpoint= "/:"+param
                method=methodParams
              } else{
                console.log('\x1b[31m%s\x1b[0m', 'function name must start with a "post","get","delete","put","patch" method');
                return 
              }
               }
            let apiRoute = `/${this.apiPrefix}${prefix}${route}`;
            if (endpoint) {
              apiRoute += endpoint;
            }
            if (this.debug) {
              console.log(apiRoute, method + " request");
            }
            let middleWare = [apiRoute];

            if(eachFile['middleware']){
             // console.log( this.validator.validator.ValidatorFactory )
            const classMiddleware = new eachFile['middleware'](
              {
                    packages: this.packages,
                    ...this.validator ,
                     services: {...injectableClasses},
                  })
            if (classMiddleware[eachRoute] && classMiddleware[eachRoute]().length>0) {
              middleWare.push(...classMiddleware[eachRoute]());
            }
            let overallMiddleware = classMiddleware["all"];
            if (overallMiddleware && overallMiddleware().length > 0) {
              middleWare.push(...overallMiddleware());
            }
          }
          // console.log(midd)
            this.#routes.push({
              method,
              middleWare,
              routeClass: routeClass[eachRoute]
            })
            if (this.debug) {
              console.log("------------------------------------------------");
            }
          }
        }
        }
      });
      return this
    };
    await  createRoute(this.dirname + this.routePath, "");
    

    for(let { method , middleWare,routeClass } of  this.#routes){
      this.app[method](...middleWare, routeClass);
      // console.log({ method , middleWare,routeClass })
    }
   await this.errorhandler(this.app)
   this.server =  this.app.listen(this.port,()=> console.log('\x1b[1m\x1b[32m%s\x1b[0m',`server listening on port ${this.port}`))
  return this
  };

  static syncDatabase = async() => {
      let models = Object.values(this.#sequelize.sequelize.models)
      let allModels = {}
      if(models.length>0){
        for(let model of models){
          allModels[model.name]=model
        }
      for(let model of models){
        if(model.associate){
          model.associate(allModels)
        }
      }
      // this.#sequelize?.sequelize
    await this.#sequelize?.sequelize?.sync()
    }

  }
    static close = () => {
    this.debug = false
    this.server.close()
    return this
  }
  static connectDocumentation = (...args) => {
    let document = this.app || app
    document.use(...args)
    if(this.debug){
      console.log("documentation in use")
    }
    return this
  }
  static setMiddle = (middleware) => {

    middleware(this.app || app)
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    if(this.debug){
      console.log("middleware injected")
    }
    return this
  }
  static setErrorHandler = (errorhandler) => {
    this.errorhandler=errorhandler
    if(this.debug){
      console.log("error handler in use")
    }
    return this
  }
  static #resolverCircularDependency = (circularDependencies ) => {
    return circularDependencies.reduce( (initialValue,dependency)=>{
              let innerClass = null
                let innerModel = null

                if(dependency?.injectableClass?.length>0){
                if(dependency.circularDependencies && !dependency.visited){
                  // mark the class as visited so as not to re compile it again 
                dependency.visited = true
                  innerClass =  this.#resolverCircularDependency([...dependency.injectableClass,...dependency.circularDependencies[0]()])

                }else{
                  innerClass = this.#resolverCircularDependency(dependency.injectableClass)

                }
                }
                if(dependency.injectableModel?.length>0){
                  innerModel = this.#injectableModelFunction(dependency.injectableModel)
                }

                if(dependency.class){
                const newClass = new dependency.class(
                  {
                    packages: this.packages,
                    ...this.validator ,
                     models: innerModel,
                     services:innerClass
                  })

                  initialValue[dependency.class.name] = newClass
                }
              return initialValue
            },{})
  }
    static #injectableFunction = (injectableClass)=>{
            return injectableClass.reduce((initialValue,currentClass)=>{

                let innerClass = {}
                let innerModel = {}
                let innerRepository = { }
                if(currentClass?.injectableClass?.length>0){
                  innerClass =  this.#injectableFunction(currentClass?.injectableClass)
                }
                if(currentClass.circularDependencies){
                  
                 let resolvedDependency = this.#resolverCircularDependency(currentClass.circularDependencies[0]())
                 this.injectedPackages = resolvedDependency
                }
                
                if(currentClass.injectableModel?.length>0){
                  innerModel = this.#injectableModelFunction(currentClass.injectableModel)
                }
                if(currentClass.injectableRepository?.length>0){
                  innerRepository  = this.#injectableRepositoryFunction(currentClass.injectableRepository)
                }
                
                if(currentClass.class){

                const newClass = new currentClass.class(
                  {
                    packages: this.packages,
                    ...this.validator ,
                     models: innerModel,
                     repositories: innerRepository,
                     services:{...innerClass,...this.injectedPackages}
                  })
                  initialValue[currentClass.class.name] = newClass
                }
                  return initialValue
                },{})
            }
  static getService = (Service) => {
    return this.#injectableFunction([Service])
  }
  static validateFile = (file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== ".DS_Store" &&
      file.slice(-3) === '.js' &&
      file.indexOf('test.js') === -1
    );
  };
}

module.exports = ExclusiveJs;
