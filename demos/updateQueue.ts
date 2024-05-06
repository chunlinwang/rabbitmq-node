import configurations from '../config';
import {
  bindExchangeQueue,
  createChannel,
  createExchange,
  createQueue,
  publisher,
} from '../amqp';
import { Channel } from 'amqplib';
import { RABBITMQ_TYPE_FANOUT } from '../constants';
import generateContent from './generate-content';

export default async function (rename: boolean) {
  const queueName: string = 'queue_update_params';
  const queueNameTemp: string = 'queue_update_params_temp';
  const exchangeName: string = 'update_params_exchange';

  const channel: Channel = await createChannel(configurations.rabbitmqHost);

  await createQueue(channel, {
    queueName,
    queueOptions: { durable: true, messageTtl: 5000 },
  });

  await createExchange(channel, {
    exchangeName: exchangeName,
    exchangeType: RABBITMQ_TYPE_FANOUT,
    exchangeOptions: { durable: true },
  });

  await bindExchangeQueue(channel, {
    exchangeName: exchangeName,
    queueName: queueName,
  });

  for (let i = 0; i < 10; ++i) {
    publisher.publish(channel, exchangeName, '', generateContent(exchangeName));
  }

  await new Promise((resolve) => {
    console.log(`Wait for 5 seconds!`);
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });

  if (rename) {
    await channel.unbindQueue(queueName, exchangeName, '');
    await channel.assertQueue(queueNameTemp, {
      durable: false,
      messageTtl: 15000,
    });
    await bindExchangeQueue(channel, {
      exchangeName: exchangeName,
      queueName: queueNameTemp,
    });
  } else {
    await channel.assertQueue(queueName, { durable: false, messageTtl: 15000 });
  }

  process.exit(0);
}
