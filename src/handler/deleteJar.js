"use strict";
const getClient = require("../mongo_client.js");

module.exports.deleteJar = async (event, context, callback) => {
  let response = [];
  try {
    const params = {
      Key: {
        id: event.pathParameters.id,
      },
    };

    const client = await getClient.getClient();
    const db = await client.db("jar");
    const jarsTable = await db.collection("jars");
    const result = await jarsTable.deleteOne(params.Key);
    if (result !== null) {
      response = {
        statusCode: 202,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "*",
        },
        body: JSON.stringify({
          message: result,
        }),
      };
    } else {
      response = {
        statusCode: 500,
        body: JSON.stringify({
          message: "jar not found",
        }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "*",
        },
      };
    }
  } catch (e) {
    console.warn(e);
    response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({
        message: e,
      }),
    };
  } finally {
    return response;
  }
};
