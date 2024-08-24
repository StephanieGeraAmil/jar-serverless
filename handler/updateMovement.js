"use strict";
const getClient = require("../mongo_client.js");

module.exports.updateMovement = async (event, context, callback) => {
    let response = [];
  try {
    const now = new Date().toISOString();
    const data = JSON.parse(event.body);
    const upd = {
      updatedAt: now,
    };

    if (data.concept) {
      upd.concept = data.concept;
    }
    if (data.amount) {
      upd.amount = data.amount;
    }
    if (data.jar) {
      upd.jar = data.jar;
    }
  
    const params = {
      Item: { $set: upd },
      Key: {
        id: event.pathParameters.id,
      },
    };

    const client = await getClient.getClient();
    const db = await client.db("jar");
    const movementsTable = await db.collection("movements");
    const result = await movementsTable.updateOne(params.Key, params.Item);
    if (result !== null) {
      response = {
        statusCode: 204,
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
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "*",
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
