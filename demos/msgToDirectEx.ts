import configurations from '../config';
import generateContent from './generate-content';
import { RABBITMQ_TYPE_DIRECT } from '../constants';
import {
  bindExchangeQueue,
  createChannel,
  createExchange,
  createQueue,
  publisher,
} from '../amqp';

import { Channel } from 'amqplib';

const exchangeDirectAnimal = 'exchange_direct_animal';
const queueDirectCat = 'queue_direct_cat';
const queueDirectDog = 'queue_direct_dog';
const routingKeyCat = 'cat';
const routingKeyDog = 'dog';
const routingKeyAnimal = 'animal';

export default async function () {
  const channel: Channel = await createChannel(configurations.rabbitmqHost);

  await createQueue(channel, {
    queueName: queueDirectCat,
    queueOptions: { durable: true },
  });

  await createQueue(channel, {
    queueName: queueDirectDog,
    queueOptions: { durable: true },
  });

  await createExchange(channel, {
    exchangeName: exchangeDirectAnimal,
    exchangeType: RABBITMQ_TYPE_DIRECT,
    exchangeOptions: { durable: true },
  });

  await bindExchangeQueue(channel, {
    queueName: queueDirectCat,
    exchangeName: exchangeDirectAnimal,
    routingKey: routingKeyCat,
  });
  await bindExchangeQueue(channel, {
    queueName: queueDirectDog,
    exchangeName: exchangeDirectAnimal,
    routingKey: routingKeyDog,
  });
  await bindExchangeQueue(channel, {
    queueName: queueDirectCat,
    exchangeName: exchangeDirectAnimal,
    routingKey: routingKeyAnimal,
  });
  await bindExchangeQueue(channel, {
    queueName: queueDirectDog,
    exchangeName: exchangeDirectAnimal,
    routingKey: routingKeyAnimal,
  });

  publisher.publish(
    channel,
    exchangeDirectAnimal,
    routingKeyCat,
    generateContent(exchangeDirectAnimal, { routingKey: routingKeyCat }),
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeDirectAnimal,
    routingKeyDog,
    generateContent(exchangeDirectAnimal, { routingKey: routingKeyDog }),
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeDirectAnimal,
    routingKeyAnimal,
    generateContent(exchangeDirectAnimal, { routingKey: routingKeyAnimal }),
  );
  await checkQueues(channel);

  await channel.close();
  process.exit(0);
}

const checkQueues = async (channel: Channel) => {
  const { messageCount: messageCountCat } =
    await channel.checkQueue(queueDirectCat);
  const { messageCount: messageCountDog } =
    await channel.checkQueue(queueDirectDog);
  console.log(
    `The messageCount in Queue ${queueDirectCat}: ${messageCountCat}`,
  );
  console.log(
    `The messageCount in Queue ${queueDirectDog}: ${messageCountDog}`,
  );
  console.log(`---------------------------------------------------`);
};
