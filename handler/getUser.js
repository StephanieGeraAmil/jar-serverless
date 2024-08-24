"use strict";
const getClient = require("../mongo_client.js");
const { createUser } = require("./createUserHelper");

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
    console.log("param",params);
    const db = await client.db("jar");
    const users = await db.collection("users");
    let result = null;
    if (params && params.Key) {
      result = await users.findOne({ email: params.Key });
      console.log("result of find",result);
      if(result==null){
       const newUser= createUser({email: params.Key})
       console.log("created user",newUser);
       const resultInsertion = await users.insertOne(newUser);
       if (!resultInsertion["acknowledged"]) return;
       result = await users.findOne(resultInsertion.id);
      }
    } else {
      result = await users.find().toArray();
      console.log("users list",result);
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





module.exports.getUserByEmail = async (event) => {
  let response = null;
  try {
    let params = {};
    const client = await getClient.getClient();

    if (event.queryStringParameters) {
      params = {
        Key: event.queryStringParameters.email,
      };
    }

    console.log("params", params);

    const db = await client.db("jar");
    const users = await db.collection("users");

    let result = null;
    if (params && params.Key) {
      result = await users.findOne({ email: params.Key });
      console.log("result of find", result);

      if (result == null) {
        const newUser = await createUser({ email: params.Key });
        console.log("created user", newUser);

        const resultInsertion = await users.insertOne(newUser);
        if (resultInsertion.acknowledged) {
          result = await users.findOne({ _id: resultInsertion.insertedId });
        }
      }
    } else {
      result = await users.find().toArray();
      console.log("users list", result);
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
        message: e.message,
      }),
    };
  } finally {
    return response;
  }
};