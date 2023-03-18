const net = require("net");
const { createPool } = require("generic-pool");

class TcpClient {
  #buffer = Buffer.alloc(0);
  constructor(config) {
    this.config = config;
    this.isConnected = false;
    this.pool = createPool({
      create: () => this.createConnection(),
      destroy: (client) => client.destroy(),
      max: config.poolMax || 10,
      min: config.poolMin || 0,
      testOnBorrow: true,
      acquireTimeoutMillis: config.poolAcquireTimeoutMillis || 30000,
    });
  }

  createConnection() {
    const client = net.createConnection(this.config, () => {
      console.log("connected to server");
      this.isConnected = true;
    });

    // Receive data from the server
    client.on("data", (data) => {
      console.log("Received data from server:", data.toString());
    });

    // Handle errors
    client.on("error", (error) => {
      console.error("An error occurred:", error.message);
      this.isConnected = false;
      console.error("An error occurred:", error.message);
    });

    client.on("close", () => {
      console.log("Disconnected from server");
      this.isConnected = false;
      setTimeout(() => {
        this.pool = createPool({
          create: () => this.createConnection(),
          destroy: (client) => client.destroy(),
          max: this.config.poolMax || 10,
          min: this.config.poolMin || 0,
          testOnBorrow: true,
          acquireTimeoutMillis: this.config.poolAcquireTimeoutMillis || 30000,
        });
      }, 5000);
    });
    client.on("end", () => {
      console.log("Disconnected from server");
      this.isConnected = false;
      setTimeout(() => {
        this.pool = createPool({
          create: () => this.createConnection(),
          destroy: (client) => client.destroy(),
          max: this.config.poolMax || 10,
          min: this.config.poolMin || 0,
          testOnBorrow: true,
          acquireTimeoutMillis: this.config.poolAcquireTimeoutMillis || 30000,
        });
      }, 5000);
    });

    return client;
  }

  async send(message, timeout = 1000) {
    if (typeof message !== "object") {
      throw new Error("Invalid message format");
    }
    message = JSON.stringify(message) + "\n";
    const client = await this.pool.acquire();
    try {
      return new Promise((resolve, reject) => {
        let timeoutId = setTimeout(() => {
          reject(new Error(`Timed out after ${timeout}ms`));
        }, timeout);
        client.write(message, (err) => {
          if (err) {
            console.error("Error sending message:", err.message);
            clearTimeout(timeoutId);
            reject(err);
          } else {
            client.once("data", (data) => {
              this.#buffer = Buffer.concat([this.#buffer, data]);
              while (this.#buffer.length > 0) {
                const parsedData = this.parseMessage(this.#buffer);
                if (parsedData === null) {
                  clearTimeout(timeoutId);
                  resolve(false);
                  return;
                }
                // clearTimeout(timeoutId);
                resolve(parsedData);
                return;
              }
            });
          }
        });
      });
    } catch (err) {
      console.error("Error sending message:", err.message);
      throw err;
    } finally {
      this.pool.release(client);
    }
  }
  async emit(message) {
    if (typeof message !== "object") {
      throw new Error("Invalid message format");
    }
    message = JSON.stringify(message) + "\n";
    const client = await this.pool.acquire();
    try {
      return new Promise((resolve, reject) => {
        let timeoutId = setTimeout(() => {
          reject(new Error(`Timed out after ${timeoutMillis}ms`));
        }, 10);
        client.write(message, (err) => {
          if (err) {
            console.error("Error sending message:", err.message);
            clearTimeout(timeoutId);
            reject(err);
          } else {
            clearTimeout(timeoutId);
            resolve(true);
          }
        });
      });
    } finally {
      this.pool.release(client);
    }
  }
  parseMessage(buffer) {
    const delimiter = Buffer.from("\n");
    const delimiterIndex = buffer.indexOf(delimiter);

    if (delimiterIndex === -1) {
      // console.log("Not enough data to parse a complete message");
      return null;
    }

    // Extract message from buffer
    const message = buffer.slice(0, delimiterIndex).toString();

    // Return message and remove delimiter from buffer
    return {
      data: JSON.parse(message),
    };
  }
}
