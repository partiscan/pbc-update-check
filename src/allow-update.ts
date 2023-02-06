import {
    ASSUMED_BLOCK_PRODUCTION_TIME_IN_SECONDS,
    ASSUMED_UPDATE_TIME_IN_SECONDS,
    NEW_COMMITTEE_TRESHOLD,
    NODE_ADDRESS
} from "./config.js";
import { guessCurrentProducer } from "./guess-current-producer.js";
import { CurrentProducer } from "./partisia-api.types.js";
import { PartisiaApi } from "./partisia.api.js";

const getTurnsLeft = (
  memberIndex: number,
  producer: number,
  committeeSize: number
): number => {
  if (memberIndex < producer) {
    return memberIndex + committeeSize - producer;
  }

  return memberIndex - producer;
};

export const isSoonProducing = (
  memberIndex: number,
  producer: CurrentProducer | null,
  committeeSize: number
): boolean => {
  if (producer === null) {
    return false;
  }

  const turnsLeft = getTurnsLeft(
    memberIndex,
    producer.producerIndex,
    committeeSize
  );
  const timeLeft =
    ((turnsLeft - 1) * 100 + producer.remainingBlocks) *
    ASSUMED_BLOCK_PRODUCTION_TIME_IN_SECONDS;

  return ASSUMED_UPDATE_TIME_IN_SECONDS > timeLeft;
};

const isNewCommitteeForming = (
  confirmedSinceLastCommittee: number,
  committeeSize: number
): boolean => {
  return confirmedSinceLastCommittee / committeeSize > NEW_COMMITTEE_TRESHOLD;
};

export const isSafeToUpdate = async (): Promise<{
  safeToUpdate: boolean;
  reason: string;
}> => {
  const api = new PartisiaApi();
  try {
    if (!NODE_ADDRESS) {
      return {
        safeToUpdate: true,
        reason: "Missing address: Update",
      };
    }

    const bpoc = await api.getBpocState();
    const committeeSize = bpoc.committee.length;

    if (
      isNewCommitteeForming(+bpoc.confirmedSinceLastCommittee, committeeSize)
    ) {
      return {
        safeToUpdate: false,
        reason: "New committee forming: Wait",
      };
    }

    const memberIndex = bpoc.committee.findIndex(
      (member) => member.identity === NODE_ADDRESS
    );
    if (memberIndex === -1) {
      return {
        safeToUpdate: true,
        reason: "Address not found in committee: Update",
      };
    }

    const metrics = await Promise.all([
      api.getBlocksMetrics("0"),
      api.getBlocksMetrics("1"),
      api.getBlocksMetrics("2"),
      api.getBlocksMetrics("gov"),
    ]);

    if (
      metrics
        .map((metric) => guessCurrentProducer(metric, committeeSize))
        .some((producer) =>
          isSoonProducing(memberIndex, producer, committeeSize)
        )
    ) {
      return {
        safeToUpdate: false,
        reason: "Soon producing blocks: Wait",
      };
    }

    return {
      safeToUpdate: true,
      reason: "All checks passed: Update",
    };
  } catch (e) {
    // If any errors happen, lets assume its fine to update
    return {
      safeToUpdate: true,
      reason: "Failed but allow update to avoid no-update loop",
    };
  }
};
