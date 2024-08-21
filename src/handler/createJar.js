"use strict";
const uuid = require("uuid");
const getClient = require("../mongo_client.js");

module.exports.createJar = async (event, context, callback) => {
  try {
    const client = await getClient.getClient();
    const now = new Date().toISOString();
    const data = JSON.parse(event.body);

    if (typeof data.name !== "string") {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "*",
        },
        body: JSON.stringify({
          message: "Jar must have an name of type string",
        }),
      };
    }

    const Item = {
      id: uuid.v4(),
      name: data.name,
      percentage: data.percentage,
      createdAt: now,
      updatedAt: now,
      creator:data.userId,
    };

    if (data.name) {
      Item.name = data.name;
    }
    if (data.percentage) {
      Item.percentage = data.percentage;
    }
   

    const db = await client.db("jar");
    const jarsTable = await db.collection("jars");
    const result = await jarsTable.insertOne(Item);
    if (!result["acknowledged"]) return;
    const jarInserted = await jarsTable.findOne(result.insertedId);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(jarInserted),
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
