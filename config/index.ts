export interface IConfiguration {
  rabbitmqHost: string;
}

const configurations: IConfiguration = {
  rabbitmqHost: process.env.RABBITMQ_HOST || 'amqp://127.0.0.1:5672',
};

export default configurations;
