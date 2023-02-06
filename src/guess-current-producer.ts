import { BlocksMetric, CurrentProducer } from "./partisia-api.types.js";

export const guessCurrentProducer = (
  metric: BlocksMetric,
  committeeSize: number
): CurrentProducer | null => {
  const currentCommittee = Object.values(metric.committees).pop();
  if (!currentCommittee) {
    return null;
  }

  // This relies on the metric api call to only return metrics for a very short period of time
  const distanceThreshold = Math.floor(committeeSize / 3);

  const producers = Object.entries(currentCommittee.producers);

  const firstProducer = producers.shift();
  if (!firstProducer) return null;

  let currentProducer: CurrentProducer = {
    producerIndex: +firstProducer[0],
    remainingBlocks: 100 - firstProducer[1].blocksProduced,
  };

  for (const [indexAsString, { blocksProduced }] of producers) {
    const index = +indexAsString;
    if (index === -1) continue;

    const isWrapping =
      index - currentProducer.producerIndex > distanceThreshold;

    currentProducer = isWrapping
      ? currentProducer
      : {
          producerIndex: index,
          remainingBlocks: 100 - blocksProduced,
        };
  }

  return currentProducer;
};
