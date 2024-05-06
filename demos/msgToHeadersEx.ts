import configurations from '../config';
import generateContent from './generate-content';
import { RABBITMQ_TYPE_HEADERS } from '../constants';
import { Channel } from 'amqplib';
import {
  bindExchangeQueue,
  createChannel,
  createExchange,
  createQueue,
  publisher,
} from '../amqp';

const exchangeHeadersProductMatch = 'exchange_headers_products';
const queueHeadersLV = 'queue_headers_lv';
const queueHeadersDior = 'queue_headers_dior';

export default async function () {
  const channel: Channel = await createChannel(configurations.rabbitmqHost);

  await createExchange(channel, {
    exchangeName: exchangeHeadersProductMatch,
    exchangeType: RABBITMQ_TYPE_HEADERS,
    exchangeOptions: { durable: true },
  });

  await createQueue(channel, {
    queueName: queueHeadersLV,
    queueOptions: { durable: true },
  });

  await createQueue(channel, {
    queueName: queueHeadersDior,
    queueOptions: { durable: true },
  });

  await bindExchangeQueue(channel, {
    queueName: queueHeadersLV,
    exchangeName: exchangeHeadersProductMatch,
    options: {
      brand: 'lv',
      category: 'shoes',
      'x-match': 'any',
    },
  });

  await bindExchangeQueue(channel, {
    queueName: queueHeadersDior,
    exchangeName: exchangeHeadersProductMatch,
    options: {
      brand: 'dior',
      category: 'clothes',
      'x-match': 'all',
    },
  });

  publisher.publish(
    channel,
    exchangeHeadersProductMatch,
    '',
    generateContent(exchangeHeadersProductMatch, {
      headers: { brand: 'lv' },
    }),
    {
      headers: {
        brand: 'lv',
      },
    },
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeHeadersProductMatch,
    '',
    generateContent(exchangeHeadersProductMatch, {
      headers: { category: 'shoes' },
    }),
    {
      headers: {
        category: 'shoes',
      },
    },
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeHeadersProductMatch,
    '',
    generateContent(exchangeHeadersProductMatch, {
      headers: { category: 'clothes' },
    }),
    {
      headers: {
        category: 'clothes',
      },
    },
  );
  await checkQueues(channel);

  publisher.publish(
    channel,
    exchangeHeadersProductMatch,
    '',
    generateContent(exchangeHeadersProductMatch, {
      headers: { brand: 'dior', category: 'clothes' },
    }),
    {
      headers: {
        brand: 'dior',
        category: 'clothes',
      },
    },
  );
  await checkQueues(channel);

  await channel.close();
  process.exit(0);
}

const checkQueues = async (channel: Channel) => {
  const { messageCount: messageCountLv } =
    await channel.checkQueue(queueHeadersLV);
  const { messageCount: messageCountDior } =
    await channel.checkQueue(queueHeadersDior);
  console.log(`The messageCount in Queue ${queueHeadersLV}: ${messageCountLv}`);
  console.log(
    `The messageCount in Queue ${queueHeadersDior}: ${messageCountDior}`,
  );
  console.log(`---------------------------------------------------`);
};
