import { getIPFSClient } from "@/services/ipfs";
import { deployMicrograntsStrategy } from "./microgrants";
import { createProfile } from "./registry";
// import { Allo } from "@allo-team/allo-v2-sdk";
// import { Allo } from "@allo-team/allo-v2-sdk/";



// // Create a new Allo instance
// export const allo = new Allo({
//   chain: 5,
//   rpc: "https://rpc.ankr.com/eth_goerli",
// });
// Importy Registry from SDK
import { Registry } from "@allo-team/allo-v2-sdk/";

// Create a new Registry instance
export const registry = new Registry({
  chain: 421614,
  rpc: "https://arbitrum-sepolia.infura.io/v3/13d58440707f4365b10cada7e86d58ed",
});
// create an allo instance
// todo: snippet => createAlloInstance

export const createPool = async () => {
  // Create a profile to use as the pool owner/creator
  // const profileId =
  //   "0x your new profile ID here";
  const profileId = await createProfile();

  // Save metadata to IPFS -> returns a pointer we save on chain for the metadata
  const ipfsClient = getIPFSClient();
  const metadata = {
    profileId: profileId,
    name: "Allo Starter Kit",
    website: "https://allo.gitcoin.co",
    description: "A starter kit for Allo",
    base64Image: "", // skipping the image for the demo
  };

  // NOTE: Use this to pin your base64 image to IPFS
  // let imagePointer;
  // if (metadata.base64Image && metadata.base64Image.includes("base64")) {
  //   imagePointer = await ipfsClient.pinJSON({
  //     data: metadata.base64Image,
  //   });
  //   metadata.base64Image = imagePointer;
  // }

  const pointer = await ipfsClient.pinJSON(metadata);
  console.log("Metadata saved to IPFS with pointer: ", pointer);

  // Deploy the microgrants strategy - `microgrants.ts`
  const poolId = await deployMicrograntsStrategy(pointer, profileId);
  console.log("Pool created with ID: ", poolId);

  return poolId;
};
