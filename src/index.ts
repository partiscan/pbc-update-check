import { exit } from "process";
import {
    isSafeToUpdate
} from "./allow-update.js";

(async () => {
  const { safeToUpdate, reason } = await isSafeToUpdate();
  console.log(reason);
  if (!safeToUpdate) {
    exit(1);
  }

  exit(0);
})();
