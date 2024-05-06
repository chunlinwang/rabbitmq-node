import { Channel, connect } from 'amqplib';

const createChannel = async (uri: string): Promise<Channel> => {
  console.log(`Connecting RabbitMq ${uri}`);

  const conn = await connect(uri);

  return conn.createChannel();
};

export default createChannel;
