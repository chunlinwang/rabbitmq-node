import configurations from '../config';
import generateContent from './generate-content';
import { RABBITMQ_TYPE_FANOUT } from '../constants';
import {
  bindExchangeQueue,
  createChannel,
  createExchange,
  createQueue,
  publisher,
} from '../amqp';

import { Channel } from 'amqplib';

const exchangeFanoutPaymentMethod = 'exchange_fanout_payment_method';
const queueFanoutPaypal = 'queue_fanout_paypal';
const queueFanoutApplePay = 'queue_fanout_apple_pay';
const queueFanoutAliPay = 'queue_fanout_ali_pay';

export default async function () {
  const channel: Channel = await createChannel(configurations.rabbitmqHost);

  await createQueue(channel, {
    queueName: queueFanoutPaypal,
    queueOptions: { durable: true },
  });

  await createQueue(channel, {
    queueName: queueFanoutApplePay,
    queueOptions: { durable: true },
  });

  await createQueue(channel, {
    queueName: queueFanoutAliPay,
    queueOptions: { durable: true },
  });

  await createExchange(channel, {
    exchangeName: exchangeFanoutPaymentMethod,
    exchangeType: RABBITMQ_TYPE_FANOUT,
    exchangeOptions: { durable: true },
  });

  await bindExchangeQueue(channel, {
    exchangeName: exchangeFanoutPaymentMethod,
    queueName: queueFanoutPaypal,
  });

  await bindExchangeQueue(channel, {
    exchangeName: exchangeFanoutPaymentMethod,
    queueName: queueFanoutAliPay,
  });

  await bindExchangeQueue(channel, {
    exchangeName: exchangeFanoutPaymentMethod,
    queueName: queueFanoutApplePay,
  });

  publisher.publish(
    channel,
    exchangeFanoutPaymentMethod,
    '',
    generateContent(exchangeFanoutPaymentMethod),
  );
  await checkQueues(channel);

  await channel.close();
  process.exit(0);
}

const checkQueues = async (channel: Channel) => {
  const { messageCount: messageCountPaypal } =
    await channel.checkQueue(queueFanoutPaypal);
  const { messageCount: messageCountApplePay } =
    await channel.checkQueue(queueFanoutApplePay);
  const { messageCount: messageCountAliPay } =
    await channel.checkQueue(queueFanoutAliPay);
  console.log(
    `The messageCount in Queue ${queueFanoutPaypal}: ${messageCountPaypal}`,
  );
  console.log(
    `The messageCount in Queue ${queueFanoutApplePay}: ${messageCountApplePay}`,
  );
  console.log(
    `The messageCount in Queue ${queueFanoutAliPay}: ${messageCountAliPay}`,
  );
  console.log(`---------------------------------------------------`);
};
