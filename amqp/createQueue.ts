import { Channel, Options } from 'amqplib';

export interface IQueueParam {
  queueName: string;
  queueOptions?: Options.AssertQueue;
}

const createQueue = async (
  channel: Channel,
  { queueName, queueOptions = null }: IQueueParam,
) => {
  return await channel.assertQueue(queueName, queueOptions);
};

export default createQueue;
