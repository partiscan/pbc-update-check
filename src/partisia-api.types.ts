type BlockProducer = {
  address: string;
  blsPublicKey: string;
  entityJurisdiction: number;
  identity: string;
  name: string;
  numberOfVotes: string;
  publicKey: string;
  serverJurisdiction: number;
  status: "CONFIRMED" | "PENDING" | "PENDING_UPDATE";
  website: string;
};

type CommitteeLog = {
  committeeMembers: BlockProducer[];
  signature: string;
  thresholdKey: string;
};

export type BpocState = {
  blockProducers: {
    key: string;
    value: BlockProducer;
  }[];
  broadcastRoundDelay: string;
  committee: BlockProducer[];
  committeeLog: { key: string; value: CommitteeLog }[];
  confirmedSinceLastCommittee: string;
  domainSeperator: string;
  kycAddresses: string[];
  largeOracleContract: string;
  retryNonce: number;
  rewardsContractAddress: string;
  sessionId: number;
  systemUpdateContractAddress: string;
  thresholdKey: {
    key: string;
    keyId: string;
  };
};

export type Contract<T> = {
  type: string;
  address: string;
  jarHash: string;
  storageLength: number;
  serializedContract: T;
  abi: string;
};

export type BlocksMetric = {
  earliestBlockProductionTime: number;
  latestBlockProductionTime: number;
  transactionCount: number;
  eventTransactionCount: number;
  blockCount: number;
  resetBlockCount: number;
  committees: Record<
    string,
    {
      producers: Record<
        string,
        { blocksProduced: number; medianFinalizationTime: number }
      >;
    }
  >;
};

export type CurrentProducer = {
  producerIndex: number;
  remainingBlocks: number;
};
