"use strict";
const getClient = require("../mongo_client.js");

module.exports.getMovement = async (event) => {
     let response = [];
  try {
    let params;

    const client = await getClient.getClient();

    if (event.queryStringParameters) {
      params = {
        Key: event.queryStringParameters,
      };
    }
    const db = await client.db("jar");
    const movementsTable = await db.collection("movements");
    let result = null;
    if (params && params.Key) {
      result = await movementsTable.findOne(params.Key);
    } else {
      result = await movementsTable.find().toArray();
    }

   if (result !== [] ) {
      response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: result,
        }),
      };
    } else {
      response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "movement not found",
        }),
      };
    }
  } catch (e) {
    console.warn(e);
    response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: e,
      }),
    };
  } finally {
    return response;
  }
};
