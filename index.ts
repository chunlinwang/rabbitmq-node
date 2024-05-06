#!/usr/bin/env node

import msgToQueue from './demos/msgToQueue';
import msgToDirectEx from './demos/msgToDirectEx';
import msgToTopicEx from './demos/msgToTopicEx';
import msgToFanoutEx from './demos/msgToFanoutEx';
import msgToHeadersEx from './demos/msgToHeadersEx';
import deadLetterAutoRetry from './demos/deadLetterAutoRetry';
import fetchMsg from './demos/fetchMsg';
import updateQueue from './demos/updateQueue';

const run = async (): Promise<void> => {
  switch(process.argv[2]) {
    case 'msg-to-queue':
      await msgToQueue();
      break;
    case 'ex-direct':
      await msgToDirectEx();
      break;
    case 'ex-topic':
      await msgToTopicEx();
      break;
    case 'ex-fanout':
      await msgToFanoutEx();
      break;
    case 'ex-headers':
      await msgToHeadersEx();
      break;
    case 'dl':
      await deadLetterAutoRetry();
      break;
    case 'prefetch':
      const prefetchCount = getFetchCount(process.argv[3])
      await Promise.all([
        fetchMsg(prefetchCount ),
        fetchMsg(prefetchCount)
      ])
      break;
    case 'update-queue':
      const rename = process.argv[3] === 'true'
      await updateQueue(rename);
      break;
    default:
      throw Error('No demo found');
  }
};

const getFetchCount = (str: string): number => {
  const num = parseInt(process.argv[3], 10);

  return isNaN(num) ? 1 : num;
}

(async () => {
  await run();
})();
