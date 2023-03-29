  
module.exports = {
  mongoose: async (mongoose, databaseUrl, maxAttempts = 9, attempt = 0) => {
    attempt++;
    return mongoose
      .connect(databaseUrl)
      .then(() => {
        console.log('\x1b[1m\x1b[32m%s\x1b[0m', 'Connected to database');
        return { connected: true };
      })
      .catch((error) => {
        if (attempt <= maxAttempts) {
          console.log(`Connection failed (attempt ${attempt}), retrying...`);
          return new Promise((resolve) => setTimeout(resolve, 5000)).then(() =>
            module.exports.mongoose(mongoose, databaseUrl, maxAttempts, attempt)
          );
        } else {
          return { message: `Failed to connect after ${maxAttempts} attempts` };
        }
      });
  },
};
