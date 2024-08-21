"use strict";
const uuid = require("uuid");
const getClient = require("../mongo_client.js");

module.exports.createMovement = async (event, context, callback) => {
  try {
    const client = await getClient.getClient();
    const now = new Date().toISOString();
    const data = JSON.parse(event.body);

    if (typeof data.concept !== "string") {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "*",
        },
        body: JSON.stringify({
          message: "Movement must have an concept of type string",
        }),
      };
    }

    const Item = {
      id: uuid.v4(),
      concept: data.concept,
      amount: data.amount,
      jar: data.jar,
      creator:data.userId,
     
    };

    if (data.concept) {
      Item.concept = data.concept;
    }
    if (data.amount) {
      Item.amount = data.amount;
    }

    const db = await client.db("jar");
    const movementsTable = await db.collection("movements");
    const result = await movementsTable.insertOne(Item);
    if (!result["acknowledged"]) return;
    const movementInserted = await movementsTable.findOne(result.insertedId);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(movementInserted),
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
