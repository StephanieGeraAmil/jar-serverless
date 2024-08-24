"use strict";
const getClient = require("../mongo_client.js");

module.exports.getJar = async (event) => {
  let response = [];
  try {
    const client = await getClient.getClient();
    const db = await client.db("jar");
    const jarsTable = await db.collection("jars");

    let result = [];
    if (event.queryStringParameters && event.queryStringParameters.userId) {
      const userId = event.queryStringParameters.userId;

      console.log(`Fetching jars for creator: ${userId}`);
      
      // Logging to verify query execution
      console.log("Query:", { creator: userId });
      result = await jarsTable.find({ creator: userId }).toArray();
      console.log("result", result);
    } else {
      result = await jarsTable.find().toArray();
      console.log("all jars", result);
    }

    if (result.length > 0) {
      response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(result),  // Return the array directly
      };
    } else {
      response = {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "No jars found for the provided userId",
        }),
      };
    }
  } catch (e) {
    console.warn(e);
    response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: e.message,
      }),
    };
  } finally {
    return response;
  }
};
