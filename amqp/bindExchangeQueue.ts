import { Channel, Options } from 'amqplib';

export interface IBindExchangeParam {
  queueName: string;
  exchangeName: string;
  routingKey?: string;
  options?: any;
}

const bindExchangeQueue = async (
  channel: Channel,
  { queueName, exchangeName, routingKey, options = {} }: IBindExchangeParam,
) => {
  await channel.bindQueue(queueName, exchangeName, routingKey, options);
};

export default bindExchangeQueue;
