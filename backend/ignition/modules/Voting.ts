import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VotingModule", (m) => {
const voting = m.contract("Voting", [], {
    value: 10_000_000_000_000_000n, // 0.01ETH
  });
  return { voting };
});