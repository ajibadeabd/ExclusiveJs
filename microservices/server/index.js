
const Tcp = require("./tcp.server")

class  MicroServiceServer {
    #microServiceConfig
    tcp
  constructor({tcp}) {
    this.tcp = tcp
  }

  event =  ( type ,topicName,callback ) => {
       this[type].setEvent({[topicName]:callback})
  }

  message =  ( type ,topicName,callback ) => {
     this[type].setMessage({[topicName]:callback})
  }
  setServerConfig =  (microServiceConfig) => {
    this.#microServiceConfig = microServiceConfig;
    return this
  }
  init = async () => {
    for (let service of this.#microServiceConfig) {
      if (service.transport === "TCP") {
        await this.tcp.connect(service.option);
      }
    }
    return this
  };
}
let tcp =  new Tcp();
module.exports = {
     MicroServiceServer: new MicroServiceServer({ tcp }),
    
} 
