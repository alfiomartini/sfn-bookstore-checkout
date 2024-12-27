import {
  SFNClient,
  SendTaskSuccessCommand,
  SendTaskFailureCommand,
} from "@aws-sdk/client-sfn";
import {
  DynamoDBClient,
  QueryCommand,
  UpdateItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

import axios from "axios";

import { SQSClient, DeleteMessageCommand } from "@aws-sdk/client-sqs";

const region = process.env.AWS_REGION || "us-east-1";
const stepFunctionsClient = new SFNClient({ region });
const dynamoDBClient = new DynamoDBClient({ region });
const sqsClient = new SQSClient({ region });

const USER_TABLE = process.env.USER_TABLE || "";
const BOOK_TABLE = process.env.BOOK_TABLE || "";

const isBookAvailable = (book, quantity) => {
  return Number(book.quantity.N) - quantity >= 0;
};

export const checkInventory = async ({ bookId, quantity }) => {
  console.log("bookId, quantity: ", bookId, quantity);
  try {
    const params = {
      TableName: BOOK_TABLE,
      KeyConditionExpression: "bookId = :bookId",
      ExpressionAttributeValues: {
        ":bookId": { S: bookId },
      },
    };
    const result = await dynamoDBClient.send(new QueryCommand(params));
    const book = result.Items[0];
    console.log("checkInventory book: ", book);

    if (isBookAvailable(book, quantity)) {
      return book;
    } else {
      const bookOutOfStockError = new Error("The book is out of stock");
      bookOutOfStockError.name = "BookOutOfStock";
      throw bookOutOfStockError;
    }
  } catch (e) {
    console.log("error: ", e);
    if (e.name === "BookOutOfStock") {
      throw e;
    } else {
      const bookNotFoundError = new Error(e);
      bookNotFoundError.name = "BookNotFound";
      throw bookNotFoundError;
    }
  }
};

export const calculateTotal = async ({ book, quantity }) => {
  console.log("book: ", book);
  const total = Number(book.price.N) * quantity;
  return { total };
};

export const billCustomer = async (params) => {
  console.log(params);
  // throw 'Error in billing'
  /* Bill the customer e.g. Using Stripe token from the parameters */
  return "Successfully Billed";
};

const deductPoints = async (userId, remaining = 0) => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId: { S: userId } },
    UpdateExpression: "set points = :remaining",
    ExpressionAttributeValues: {
      ":remaining": { N: remaining.toString() },
    },
  };
  await dynamoDBClient.send(new UpdateItemCommand(params));
};

const updateBookQuantity = async (bookId, orderQuantity) => {
  console.log("bookId: ", bookId);
  console.log("orderQuantity: ", orderQuantity);
  const params = {
    TableName: BOOK_TABLE,
    Key: { bookId: { S: bookId } },
    UpdateExpression: "SET quantity = quantity - :orderQuantity",
    ExpressionAttributeValues: {
      ":orderQuantity": { N: orderQuantity.toString() },
    },
  };
  await dynamoDBClient.send(new UpdateItemCommand(params));
};

export const redeemPoints = async ({ userId, total }) => {
  console.log("userId: ", userId);
  let orderTotal = total.total;
  console.log("orderTotal:", orderTotal);
  try {
    const params = {
      TableName: USER_TABLE,
      Key: {
        userId: { S: userId },
      },
    };
    const result = await dynamoDBClient.send(new GetItemCommand(params));
    const user = result.Item;
    const points = user.points.N;

    console.log("user: ", user);
    console.log("points: ", points);

    // redeem all points
    if (orderTotal >= points) {
      await deductPoints(userId);
      orderTotal = orderTotal - points;
      return {
        total: orderTotal,
        pointsUsed: points,
        pointsBeforeRedeem: points,
      };
    } else {
      //redeem part of the points
      const pointsUsed = Math.floor(orderTotal);
      await deductPoints(userId, points - pointsUsed);
      orderTotal = 0;
      return {
        total: orderTotal,
        pointsUsed: pointsUsed,
        pointsBeforeRedeem: points,
      };
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const restoreRedeemPoints = async ({ userId, total }) => {
  try {
    if (total.pointsBeforeRedeem) {
      const params = {
        TableName: USER_TABLE,
        Key: { userId: { S: userId } },
        UpdateExpression: "set points = :points",
        ExpressionAttributeValues: {
          ":points": { N: total.pointsBeforeRedeem.toString() },
        },
      };
      await dynamoDBClient.send(new UpdateItemCommand(params));
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const sqsWorker = async (event) => {
  try {
    const record = event.Records[0];

    const body = JSON.parse(record.body);
    const receiptHandle = record.receiptHandle;
    const queueUrl = record.eventSourceARN.split(":")[5];

    console.log("record: ", record);
    console.log("sqs worker body: ", body);
    console.log("receiptHandle: ", receiptHandle);
    console.log("queueUrl: ", queueUrl);

    // Update book quantity
    await updateBookQuantity(body.Input.bookId, body.Input.quantity);

    /** Find a courier and attach courier information to the order */
    const courier = "alfio.martini@encora.com";

    // throw "Something wrong with Courier API";
    // const noCourierAvailableError = new Error(
    //   "Something wrong with Courier API"
    // );
    // noCourierAvailableError.name = "NoCourierAvailable";
    // throw noCourierAvailableError;

    // Delete the message from the queue
    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      })
    );

    // Attach courier information to the order
    await stepFunctionsClient.send(
      new SendTaskSuccessCommand({
        output: JSON.stringify({ courier }),
        taskToken: body.Token,
      })
    );

    return { courier };
  } catch (e) {
    console.log("===== You got an Error =====");
    console.log(e);
    const record = event.Records[0];
    const body = JSON.parse(record.body);
    await stepFunctionsClient.send(
      new SendTaskFailureCommand({
        error: "NoCourierAvailable",
        cause: "No couriers are available",
        taskToken: body.Token,
      })
    );
    return "No couriers available";
  }
};

export const sqsWorkerCamunda = async (event) => {
  try {
    const record = event.Records[0];

    const body = JSON.parse(record.body);
    const receiptHandle = record.receiptHandle;
    const queueUrl = record.eventSourceARN.split(":")[5];

    console.log("record: ", record);
    console.log("sqs worker body: ", body);
    console.log("receiptHandle: ", receiptHandle);
    console.log("queueUrl: ", queueUrl);
    console.log("correlationId", body.correlationId);

    // Update book quantity
    await updateBookQuantity(body.Input.bookId, body.Input.quantity);

    /** Find a courier and attach courier information to the order */
    const courier = "alfio.martini@encora.com";

    // throw "Something wrong with Courier API";
    // const noCourierAvailableError = new Error(
    //   "Something wrong with Courier API"
    // );
    // noCourierAvailableError.name = "NoCourierAvailable";
    // throw noCourierAvailableError;

    // Delete the message from the queue
    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      })
    );

    // // Make a POST request using axios
    // const response = await axios.post(
    //   "https://ont-1.connectors.camunda.io/1441efd8-f293-40f9-bd74-b01cb8f579ff/inbound/865c332f-c0d5-43c7-b69d-47440ef13379",
    //   {
    //     correlationId: body.correlationId,
    //     courier: courier,
    //   }
    // );

    // console.log("POST request response: ", response.data);

    return { courier };
  } catch (e) {
    console.log("===== You got an Error =====");
    console.log(e);
    const record = event.Records[0];
    const body = JSON.parse(record.body);

    return "No couriers available";
  }
};

export const restoreQuantity = async ({ bookId, quantity }) => {
  const params = {
    TableName: BOOK_TABLE,
    Key: { bookId: { S: bookId } },
    UpdateExpression: "set quantity = quantity + :orderQuantity",
    ExpressionAttributeValues: {
      ":orderQuantity": { N: quantity.toString() },
    },
  };
  await dynamoDBClient.send(new UpdateItemCommand(params));
  return "Quantity restored";
};
