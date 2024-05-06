import { Channel, Options } from 'amqplib';

export interface IRabbitMQExchangeParams {
  exchangeName: string;
  exchangeType: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string;
  exchangeOptions?: Options.AssertExchange;
}

const createExchange = async (
  channel: Channel,
  {
    exchangeName,
    exchangeType,
    exchangeOptions = null,
  }: IRabbitMQExchangeParams,
) => {
  return await channel.assertExchange(
    exchangeName,
    exchangeType,
    exchangeOptions,
  );
};

export default createExchange;
