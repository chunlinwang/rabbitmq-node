import configurations from '../config';
import generateContent from './generate-content';
import createChannel from '../amqp/createChannel';
import { RABBITMQ_TYPE_DIRECT } from '../constants';

import {
  bindExchangeQueue,
  createExchange,
  createQueue,
  publisher,
} from '../amqp';
import { Channel } from 'amqplib';
import * as process from 'node:process';
import consumer from '../amqp/consumer';

const exchangeLogProcess = 'exchange_log_process';
const exchangeLogProcessDeadLetter = 'exchange_log_process_dl';
const queueLogProcessDeadLetter = 'queue_log_process_dl';
const queueLogApp = 'queue_log_app';
const routingKeyLogApp = 'log_app';
const deadLetterMessageTTL = 5000; // 5 seconds

export default async function () {
  const channel: Channel = await createChannel(configurations.rabbitmqHost);

  await createExchange(channel, {
    exchangeName: exchangeLogProcess,
    exchangeType: RABBITMQ_TYPE_DIRECT,
    exchangeOptions: { durable: true },
  });

  await createExchange(channel, {
    exchangeName: exchangeLogProcessDeadLetter,
    exchangeType: RABBITMQ_TYPE_DIRECT,
    exchangeOptions: { durable: true },
  });

  await createQueue(channel, {
    queueName: queueLogProcessDeadLetter,
    queueOptions: {
      durable: true,
      messageTtl: deadLetterMessageTTL,
      deadLetterExchange: exchangeLogProcess,
      deadLetterRoutingKey: routingKeyLogApp,
    },
  });

  await createQueue(channel, {
    queueName: queueLogApp,
    queueOptions: {
      durable: true,
      deadLetterExchange: exchangeLogProcessDeadLetter,
      deadLetterRoutingKey: routingKeyLogApp,
    },
  });

  await bindExchangeQueue(channel, {
    queueName: queueLogProcessDeadLetter,
    exchangeName: exchangeLogProcessDeadLetter,
    routingKey: routingKeyLogApp,
  });

  await bindExchangeQueue(channel, {
    queueName: queueLogApp,
    exchangeName: exchangeLogProcess,
    routingKey: routingKeyLogApp,
  });

  publisher.publish(
    channel,
    exchangeLogProcess,
    routingKeyLogApp,
    generateContent(exchangeLogProcess, { routingKey: routingKeyLogApp }),
  );
  await checkQueues(channel);

  // customer msg and reject it.
  await channel.consume(queueLogApp, consumer(channel, 1));

  // we should have a nsg in the dead letter.
  await checkQueues(channel);

  //wait for 6 seconds
  await new Promise((resolve) => {
    console.log(`Wait for 6 seconds!`);
    setTimeout(() => {
      resolve(true);
    }, 6000);
  });

  // The msg should be re-sent to the queueLogApp queue.
  await checkQueues(channel);

  await channel.close();
  process.exit(0);
}

const checkQueues = async (channel: Channel) => {
  const { messageCount: messageCountLogApp } =
    await channel.checkQueue(queueLogApp);
  console.log(
    `The messageCount in Queue ${queueLogApp}: ${messageCountLogApp}`,
  );
  const { messageCount: messageCountLogAppDeadLetter } =
    await channel.checkQueue(queueLogProcessDeadLetter);
  console.log(
    `The messageCount in Queue ${queueLogProcessDeadLetter}: ${messageCountLogAppDeadLetter}`,
  );
  console.log(`---------------------------------------------------`);
};
