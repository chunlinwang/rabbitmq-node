# Node Rabbitmq Demos

## Description

This is a node typescript project which is implemented RabbitMQ using the library amqplib.

In this project, I will show you how to implement RabbitMQ in your node application.

## Start the project
```shell
docker-compose up -d
```

## Access the RabbitMQ management page on the local machine.
[RabbitMQ management](http://127.0.0.1:15672/#/)

## Launch the demo.

### Connect to the docker container
```shell
docker-compose exec node sh
```

### Demo send message to the queue

```shell
pnpm send:queue
```

### Direct exchange demo

```shell
pnpm send:exchange:direct
```

### Fanout exchange demo

```shell
pnpm send:exchange:fanout
```

### Topic exchange demo

```shell
pnpm send:exchange:topic
```

### Headers exchange demo

```shell
pnpm send:exchange:headers
```

### Dead Letter exchange and auto retry demo

```shell
pnpm dead-lettre:auto-retey
```

### Prefetch setting demo

```shell
pnpm consume:prefetch
```


### Update queue setting demo
```shell
pnpm update:queue
```


### Format the coding style
```shell
pnpm format
```

## Blog
https://medium.com/@kazami0083/understand-rabbitmq-and-implement-it-in-the-node-application-3c5be6693817

## requirement
- Node > 22.0.0
- amqplib > 0.10.4
- rabbitmq = 3.13.1-management

## Author
* [@Chunlin Wang](https://www.linkedin.com/in/chunlin-wang-b606b159/)
