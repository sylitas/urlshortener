
const { MongoClient } = require('mongodb');

exports.mongoDBClient = async (funcName, ...query) => {
  const client = new MongoClient(process.env.DB_URI);
  try {
    console.log('😎 Sylitas | Connecting to DB');
    await client.connect();
    console.log('😎 Sylitas | Connected to DB');
    console.log('😎 Sylitas | params : ', query);
    let result;
    if (funcName === 'find') {
      result = await client.db("database").collection("collection")[funcName](...query).toArray();
    } else {
      result = await client.db("database").collection("collection")[funcName](...query);
    }
    console.log('😎 Sylitas | Execute query success');
    return result;
  } catch (error) {
    console.log('error : ', error);
  } finally {
    await client.close();
  }
}
