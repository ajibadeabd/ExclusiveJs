const net = require("net");

class Tcp {
  #service = {message:{},event:{}};
  #buffer = Buffer.alloc(0);
  #queue = []

  connect = async (config) => {
    if (!config || !config.host || !config.port) {
  console.error('Invalid configuration object:', config);
  return;
}
    const server = net.createServer((socket) => {
      this.listen(socket);
      this.errorHandler(socket, config);
      this.endConnection(socket);
    });
    this.newConnection(server);

    server.listen(config.port, config.host, () => {
      console.log(`microService created on ${config.host}:${config.port}`);
    });
  };

  parseMessage = (buffer) => {
    const delimiter = Buffer.from('\n');
    const delimiterIndex = buffer.indexOf(delimiter);

    if (delimiterIndex === -1) {
      console.log(" Not enough data to parse a complete message")
      return null;
    }

    // Extract message from buffer
    const message = buffer.slice(0, delimiterIndex).toString();

    // Return message and remove delimiter from buffer
    this.#buffer = buffer.slice(delimiterIndex + delimiter.length);
    return message.trim();
  };

  listen = async(socket) => {
    let a = 0
    socket.on("data", async(data) => {
      this.#buffer = Buffer.concat([this.#buffer, data]);
      while (this.#buffer.length > 0) {
        const message = this.parseMessage(this.#buffer);
        if (!message) {
          console.log(" Not enough data to parse a complete message")
          break;
        }
      //  data = JSON.parse( message);
      let parsedData;
         try {
            parsedData = JSON.parse(message);
        } catch (error) {
          console.error('Error parsing JSON message:', error);
          return;
          }

        // Add the message to the queue
        this.#queue.push(parsedData);
        while (this.#queue.length > 0) {
          const nextData = this.#queue[0];
          const handler = this.#service.event?.[nextData?.topic];

          if (handler) {
            const response = await handler(nextData);
            socket.write(JSON.stringify({response,number:a}) + "\n");

            this.#queue.shift(); // Remove the processed message from the queue
          } else {
            console.log(`No handler found for topic '${nextData?.topic}'`);
          const errorResponse = {
            error: `No handler found for topic ${nextData?.topic}`
          };
          socket.write(JSON.stringify(errorResponse) + "\n");
          this.#queue.shift(); // Remove the processed message from the queue
          break;
          }
        }
      }
    });
  };

  newConnection = (server) => {
    server.on("connection",(socket)=>{
      console.log("Client connected:", socket.remoteAddress, socket.remotePort);
    });
  };

  setEvent = (service) => {
    this.#service.event = {...this.#service.event,...service};
  };
  setMessage = (service) => {
    this.#service.message = {...this.#service.message,...service};
  };
  

  endConnection = (socket) => {
    socket.on("end", () => {
      console.log(
        "Client disconnected:",
        socket.remoteAddress,
        socket.remotePort
      );
    });
  };

  errorHandler = (socket,config) => {
    socket.on("error", (error) => {
      console.error("An error occurred:", error);
      if (error.code === 'EADDRINUSE') {
        console.error('Address in use, retrying...');
        setTimeout(() => {
          socket.close();
          server.listen(config.port, config.host, () => {
            console.log(`microService created on ${config.host}:${config.port}`);
          });
        }, 1000);
      }
    });
  };
}

module.exports = Tcp;
