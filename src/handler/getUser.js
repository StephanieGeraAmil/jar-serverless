"use strict";
const getClient = require("../mongo_client.js");

module.exports.getUser = async (event) => {
  try {
    let params;
    let response = null;
    const client = await getClient.getClient();

    if (event.queryStringParameters) {
      params = {
        Key: event.queryStringParameters,
      };
    }
    const db = await client.db("jar");
    const users = await db.collection("users");
    let result = null;
    if (params && params.Key) {
      result = await users.findOne(params.Key);
    } else {
      result = await users.find().toArray();
    }

    if (result !== null) {
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
          message: "user not found",
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
