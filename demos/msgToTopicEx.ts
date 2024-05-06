import configurations from '../config';
import generateContent from './generate-content';
import { RABBITMQ_TYPE_TOPIC } from '../constants';
import { Channel } from 'amqplib';
import {
  bindExchangeQueue,
  createChannel,
  createExchange,
  createQueue,
  publisher,
} from '../amqp';

const exchangeTopicSport = 'exchange_topic_sport';
const queueTopicSport = 'queue_topic_sport';
const routingKeySki = 'topic.sport.ski';
const routingKeyBadminton = 'topic.sport.badminton';

export default async function () {
  const channel: Channel = await createChannel(configurations.rabbitmqHost);

  await createQueue(channel, {
    queueName: queueTopicSport,
    queueOptions: { durable: true },
  });

  await createExchange(channel, {
    exchangeName: exchangeTopicSport,
    exchangeType: RABBITMQ_TYPE_TOPIC,
    exchangeOptions: { durable: true },
  });

  await bindExchangeQueue(channel, {
    queueName: queueTopicSport,
    exchangeName: exchangeTopicSport,
    routingKey: '*.sport.*',
  });

  publisher.publish(
    channel,
    exchangeTopicSport,
    'error',
    generateContent(exchangeTopicSport),
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeTopicSport,
    'topic.sport.*',
    generateContent(exchangeTopicSport, { routingKey: 'topic.sport.*' }),
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeTopicSport,
    'topic.sport.',
    generateContent(exchangeTopicSport, { routingKey: 'topic.sport.' }),
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeTopicSport,
    'news.sport.any',
    generateContent(exchangeTopicSport, { routingKey: 'news.sport.any' }),
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeTopicSport,
    routingKeySki,
    generateContent(exchangeTopicSport, { routingKey: routingKeySki }),
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeTopicSport,
    routingKeyBadminton,
    generateContent(exchangeTopicSport, { routingKey: routingKeyBadminton }),
  );
  await checkQueues(channel);

  await channel.close();
  process.exit(0);
}

const checkQueues = async (channel: Channel) => {
  const { messageCount: messageCountSport } =
    await channel.checkQueue(queueTopicSport);
  console.log(
    `The messageCount in Queue ${queueTopicSport}: ${messageCountSport}`,
  );
  console.log(`---------------------------------------------------`);
};
