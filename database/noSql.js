module.exports = {

    mongoose: async(mongoose,databaseUrl)=>{
    // mongoose.set("strictQuery", false);
   return  mongoose
      .connect(databaseUrl)
      .then(() => {
        console.log('\x1b[1m\x1b[32m%s\x1b[0m',"Connected to database");
        return {connected : true}
      })
      .catch((error) =>{
        return  {message : error.message}
        });
    }
    
}
 