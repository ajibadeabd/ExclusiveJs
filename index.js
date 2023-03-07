const fs = require('fs');
const path = require('path'); 
const express = require('express') 
const app = express()

class  ExclusiveJs {

  static instance = () => {
    if (this.newInstance) return this
    this.routePath = "src/routes";
    this.dirname = process.cwd() + "/";
    this.debug = true;
    this.apiPrefix = "api";
    this.packages = {}
    this.validator = {}
    this.injectedPackages = {}
    this.port = process.env.PORT || 1234
    this.app = null
    this.server = null
    this.newInstance = this.newInstance ? this.newInstance : new this();
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

  static setValidator = (validator) => {
    this.validator =  validator
    if(this.debug){
      console.log("validation in use")
    }
    return this;
  };

  static injectPackages = () => {
    // only compile package your installed not inbuilt package
    const  packageJson =  fs.readFileSync("./package.json", "utf8");

    // Parse contents as JSON object
    const packageObject = JSON.parse(packageJson);

    for (let eachPackages in packageObject.dependencies) {
    this.packages[eachPackages] = require(eachPackages)
    }
    return this;
  };

  static setRoutePath = (path) => {
    this.routePath = path;
    return this;
  };

  static setApiPrefix = (apiPrefix) => {
    this.apiPrefix = apiPrefix;
    return this;
  };

  
  static #injectableModelFunction = (injectableClass)=>{
    return injectableClass.reduce((initialValue,currentModels)=>{
         initialValue[currentModels.modelName] = currentModels
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

  static init = () => {
    this.app = this.app ? this.app : app;

    let createRoute = (directory, prefix) => {
      this.sortFile(directory).forEach((file) => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
          return createRoute(filePath, prefix + "/" + file.replace("]", "").replace("[", ":"));
        } else if (this.validateFile(file)) {
          const eachFile = require(filePath)
          let route = file.split(".")[0]
            .replace("index", "")
            .replace(/\s+/g, "");
            let injectableClasses = {}
            let injectableModels = {}
            const  injectableClass = eachFile['injectableClass']
            const  injectableModel = eachFile['injectableModel']
            const  circularDependencies = eachFile['circularDependencies'] 
            // if(circularDependencies){

              let circle = (circularDependencies)=>{
             return circularDependencies.reduce( (initialValue,dependency)=>{
              let innerClass = null
                let innerModel = null

                if(dependency?.injectableClass?.length>0){
                if(dependency.circularDependencies && !dependency.visited){
                  // mark the class as visited so as not to re compile it again 
                dependency.visited = true
                  innerClass =  circle([...dependency.injectableClass,...dependency.circularDependencies[0]()])

                }else{
                  innerClass =  circle(dependency.injectableClass)

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
            // circle(circularDependencies)
            // }
 
            const injectableFunction = (injectableClass)=>{
            return injectableClass.reduce((initialValue,currentClass)=>{
                let innerClass = null
                let innerModel = null
                if(currentClass?.injectableClass?.length>0){
                  innerClass =  injectableFunction(currentClass?.injectableClass)
                }
                if(currentClass.circularDependencies){
                  
                 let resolvedDependency =  circle(currentClass.circularDependencies[0]())
                 this.injectedPackages = resolvedDependency
                }
                
                if(currentClass.injectableModel?.length>0){
                  innerModel = this.#injectableModelFunction(currentClass.injectableModel)
                }
                
                if(currentClass.class){

                const newClass = new currentClass.class(
                  {
                    packages: this.packages,
                    ...this.validator ,
                     models: innerModel,
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
                    models: injectableModels,
                    services: {...injectableClasses,  },
                  })
          for (const eachRoute in routeClass) {
            let [method, endpoint] = eachRoute.split(".");
            if(!["post","get","delete","put","patch"].includes(method)){
              
              let[ methodParams, param] = method.split(":")
              if(param && ["post","get","delete","put","patch"].includes(methodParams)){
                endpoint= ":"+param
                method=methodParams
              } else{
                console.log('\x1b[31m%s\x1b[0m', 'function name must start with a "post","get","delete","put","patch" method');
                return 
              }
               }
            let apiRoute = `/${this.apiPrefix}${prefix}/${route}`;
            if (endpoint) {

            // endpoint = endpoint.replace(":", "/:");
              apiRoute += endpoint;
              // console.log({apiRoute,endpoint})

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
          
            
        this.app[method](...middleWare, routeClass[eachRoute]);
            if (this.debug) {
              console.log("------------------------------------------------");
            }
          }
        }
        }
      });
      return this
    };
     createRoute(this.dirname + this.routePath, "");
   this.server =  this.app.listen(this.port,()=>console.log("server listening on port",this.port))
  return this
  };

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

    errorhandler(this.app || app)
    if(this.debug){
      console.log("error handler in use")
    }
    return this
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
