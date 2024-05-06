import { Channel } from 'amqplib';

const publish = (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  content: Buffer,
  options: any = {},
): boolean => {
  return channel.publish(exchangeName, routingKey, content, options);
};

const sendToQueue = (
  channel: Channel,
  queueName: string,
  content: Buffer,
  options: any = {},
): boolean => {
  return channel.sendToQueue(queueName, content, options);
};

export default { publish, sendToQueue };
