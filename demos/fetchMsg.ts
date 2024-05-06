import configurations from '../config';
import generateContent from './generate-content';
import { publisher, createChannel, createQueue, consumer } from '../amqp';
import { Channel } from 'amqplib';
import { delay } from 'bluebird';

export default async function (prefetchCount: number = 1) {
  const queueName: string = 'queue_multiple_fetch';

  const channel: Channel = await createChannel(configurations.rabbitmqHost);

  await createQueue(channel, { queueName, queueOptions: { durable: true } });

  for (let i = 0; i < 10; ++i) {
    publisher.sendToQueue(
      channel,
      queueName,
      generateContent(queueName, { loop: i }),
    );
  }

  const { messageCount, consumerCount } = await channel.checkQueue(queueName);
  console.log(
    `Consumer count: ${consumerCount}`,
    `There ${messageCount > 1 ? 'are ' : 'is'} ${messageCount} message(s) in the Queue ${queueName}`,
  );

  await channel.prefetch(prefetchCount);
  await channel.consume(
    queueName,
    async (msg) => {
      while (true) {
        console.log(`${JSON.stringify(msg.fields)}`);
      }
    },
    { noAck: false },
  );

  await channel.close();
  process.exit(0);
}
