import got from "got";
import { FALLBACK_API, MAIN_API } from "./config.js";
import { BlocksMetric, BpocState, Contract } from "./partisia-api.types.js";

type Shard = "0" | "1" | "2" | "gov";

export class PartisiaApi {
  public async getBpocState(): Promise<BpocState> {
    const contact = await this.request<Contract<BpocState>>(
      "/blockchain/contracts/04203b77743ad0ca831df9430a6be515195733ad91?requireContractState=true",
      "0"
    );

    return contact.serializedContract;
  }

  public async getBlocksMetrics(shard: Shard): Promise<BlocksMetric> {
    return await this.request<BlocksMetric>("/metrics/blocks/360", shard);
  }

  private async request<T>(path: string, shard: Shard): Promise<T> {
    const shardSuffix = shard === "gov" ? "" : `/shards/Shard${shard}`;
    const url = `${MAIN_API}${shardSuffix}${path}`;

    try {
      return await got(`${url}${shardSuffix}${path}`).json<T>();
    } catch (e) {
      console.log("Failed on main reader. Fallback secondary reader.");
      return await got(`${FALLBACK_API}${shardSuffix}${path}`).json<T>();
    }
  }
}
