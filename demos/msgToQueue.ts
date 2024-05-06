import configurations from '../config';
import generateContent from './generate-content';
import { publisher, createChannel, createQueue } from '../amqp';
import { Channel } from 'amqplib';

export default async function () {
  const queueName: string = 'queue_without_exchange';

  const channel: Channel = await createChannel(configurations.rabbitmqHost);

  await createQueue(channel, { queueName, queueOptions: { durable: true } });

  const content: Buffer = generateContent(queueName);

  if (publisher.sendToQueue(channel, queueName, content)) {
    const { messageCount } = await channel.checkQueue(queueName);
    console.log(`The message ${content.toString()} was sent to ${queueName}.`);
    console.log(
      `There ${messageCount > 1 ? 'are ' : 'is'} ${messageCount} message(s) in the Queue ${queueName}`,
    );
    await channel.close();
    process.exit(0);
  } else {
    throw Error(
      `The message ${content.toString()} was not sent to ${queueName}`,
    );
  }
}
