"use strict";
const uuid = require("uuid");
const getClient = require("../mongo_client.js");
const { createUser } = require("./createUserHelper");

module.exports.createUser = async (event, context, callback) => {
  try {
    const client = await getClient.getClient();
    
    const data = JSON.parse(event.body);

    if (typeof data.email !== "string") {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "*",
        },
        body: JSON.stringify({
          message: "User must have an email of type string",
        }),
      };
    }
    const Item= createUser(data);
    const db = await client.db("jar");
    const userTable = await db.collection("users");
    const result = await userTable.insertOne(Item);
    if (!result["acknowledged"]) return;
    const userInserted = await userTable.findOne(result.insertedId);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(userInserted),
    };
  } catch (e) {
    console.warn(e);
    return {
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
  }
};
