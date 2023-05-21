const amqp = require("amqplib");

const rabbitmqUrl =
  "amqps://user:$password$gang@b-2fc29029-049f-4419-82dc-c9f9d0b26ed8.mq.eu-north-1.amazonaws.com:5671";
const queueName = "pdfConversionQueue";
const exchangeName = "pdfConversionExchange";

async function setupRabbitMQ() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    // Ensure that the queue exists, otherwise create it
    await channel.assertQueue(queueName, { durable: true });

    // Bind the queue to the exchange
    await channel.bindQueue(queueName, exchangeName, "");

    console.log("RabbitMQ setup completed successfully");

    // Return the connection and channel objects
    return { connection, channel };
  } catch (error) {
    console.error("Failed to setup RabbitMQ:", error);
    throw error;
  }
}

module.exports = { setupRabbitMQ, queueName, exchangeName };
