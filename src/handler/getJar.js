"use strict";
const getClient = require("../mongo_client.js");

module.exports.getJar = async (event) => {
  let response = [];
  try {
    let params;
    const client = await getClient.getClient();
    console.log(client);
    if (event.queryStringParameters) {
      params = {
        Key: event.queryStringParameters,
      };
    }
    const db = await client.db("jar");
        console.log(db);
    const jarsTable = await db.collection("jars");
          console.log(jarsTable);
    let result = null;
    if (params && params.Key) {
      result = await jarsTable.findOne(params.Key);
    } else {
      result = await jarsTable.find().toArray();
    }
      console.log(result);
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
          message: "jar not found",
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
