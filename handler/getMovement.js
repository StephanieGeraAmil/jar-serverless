"use strict";
const getClient = require("../mongo_client.js");

module.exports.getMovement = async (event) => {
  let response = [];
  try {
    const client = await getClient.getClient();
    const db = await client.db("jar");
    const movementsTable = await db.collection("movements");

    let result = [];
    if (event.queryStringParameters && event.queryStringParameters.userId) {
      const userId = event.queryStringParameters.userId;
      result = await movementsTable.find({ creator: userId }).toArray();
      console.log("result", result);
    } else {
      result = await movementsTable.find().toArray();
      console.log("all movements", result);
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
        statusCode: 404,  // Use 404 for not found
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "No movements found for the provided userId",
        }),
      };
    }
  } catch (e) {
    console.warn(e);
    response = {
      statusCode: 500,  // Use 500 for server errors
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
