import { Channel } from 'amqplib';
import { ConsumeMessage } from 'amqplib/properties';

const consumer =
  (channel: Channel, maxRetry: number = 5) =>
  async (msg: ConsumeMessage | null) => {
    if (msg !== null) {
      if (msg.fields.deliveryTag > maxRetry) {
        console.log(
          `The max retry is reached, msg is accepted: ${JSON.stringify(msg.fields)}`,
        );
        return channel.ack(msg);
      }

      // We should add all logic of consumer in this function.

      // if this msg is accepted
      // return ch.ack(msg);

      console.log(`Msg is rejected: ${JSON.stringify(msg.fields)}`);
      // if this msg is rejected, it will be send to dead_letter_exchange
      return channel.reject(msg, false);
    }

    console.log(`Msg is accepted: ${JSON.stringify(msg.fields)}`);
    return channel.ack(msg);
  };

export default consumer;
