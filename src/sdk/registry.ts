import Web3 from "web3";
import { RegistryABI } from "@/abi/Registry";
import { wagmiConfigData } from "@/services/wagmi";
import { getEventValues } from "@/utils/common";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { sendTransaction } from "@wagmi/core";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import fetch from "node-fetch";

// Replace 'YOUR_INFURA_PROJECT_ID' with your actual Infura project ID
const infuraProjectId = "100d0067b115436a994846ba2d1a0386";

// Arbitrum Sepolia network RPC URL
const arbitrumSepoliaRpcUrl =
  "https://arbitrum-sepolia.infura.io/v3/" + infuraProjectId;

// Create Web3 instance with the Infura provider for Arbitrum Sepolia
const web3 = new Web3(arbitrumSepoliaRpcUrl);

// Import Registry from SDK
import { Registry } from "@allo-team/allo-v2-sdk/";

// Create a new Registry instance
export const registry = new Registry({
  chain: 421614,
  rpc: arbitrumSepoliaRpcUrl,
});

// Function to get current gas price from the network
const getCurrentGasPrice = async (): Promise<BigInt | null> => {
  try {
    // Get current gas price in Wei
    const gasPriceInWei = BigInt(await web3.eth.getGasPrice());

    console.log(`Current gas price: ${gasPriceInWei} Wei`);
    return gasPriceInWei;
  } catch (error) {
    console.error("Error getting current gas price:", error);
    return null;
  }
};

// Function to estimate gas cost using the current gas price
const getGasPriceInWei = async (): Promise<BigInt | null> => {
  try {
    const gasPriceInWei = await getCurrentGasPrice();

    if (gasPriceInWei !== null) {
      console.log(`Using current gas price: ${gasPriceInWei} Wei`);
      return gasPriceInWei;
    } else {
      console.error("Failed to get current gas price. Aborting transaction.");
      return null;
    }
  } catch (error) {
    console.error("Error getting gas price for estimation:", error);
    return null;
  }
};

// Function to create a profile
export const createProfile = async () => {
  console.log("Creating profile...");

  try {
    // Get gas price in Wei
    const gasPriceInWei = await getGasPriceInWei();

    if (gasPriceInWei !== null) {
      console.log(`Using gas price: ${gasPriceInWei} Wei`);

      // Prepare the arguments -> type comes from the SDK
      const createProfileArgs: CreateProfileArgs = {
        nonce: Math.floor(Math.random() * 10000),
        name: "Allo Workshop",
        metadata: {
          protocol: BigInt(1),
          pointer:
            "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
        },
        members: ["0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42"],
        owner: "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
      };

      // Create the transaction with the arguments -> type comes from SDK
      const txData: TransactionData = await registry.createProfile(
        createProfileArgs
      );

      // Send the transaction with specified gas price
      const txHash = await sendTransaction({
        to: txData?.to,
        data: txData?.data,
        value: BigInt(txData.value),
        gas: gasPriceInWei as bigint,
      });

      // Wait for transaction receipt
      const receipt =
        await wagmiConfigData.publicClient.waitForTransactionReceipt({
          hash: txHash.hash,
          confirmations: 2,
        });

      // Extract profileId from the receipt
      const profileId =
        getEventValues(receipt, RegistryABI, "ProfileCreated")?.profileId ||
        "0x";

      if (profileId === "0x") {
        throw new Error("Profile creation failed");
      }

      console.log(`Profile created successfully. Profile ID: ${profileId}`);
      return profileId;
    } else {
      console.error("Failed to estimate gas price. Aborting transaction.");
    }
  } catch (error) {
    console.error("Profile creation error:", error);
  }
};

// Other functions (if any)

// ...

// import { RegistryABI } from "@/abi/Registry";
// import { wagmiConfigData } from "@/services/wagmi";
// import { getEventValues } from "@/utils/common";
// // import { Registry } from "@allo-team/allo-v2-sdk";
// import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
// import { sendTransaction } from "@wagmi/core";
// import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
// import fetch from "node-fetch";

// // create a registry instance
// // todo: snippet => createRegistryInstance

// // Importy Registry from SDK
// // import { Registry } from "@allo-team/allo-v2-sdk/";

// // Create a new Registry instance
// // export const registry = new Registry({
// //   chain: 5,
// //   rpc: "https://rpc.ankr.com/eth_goerli",
// // });

// // Importy Registry from SDK
// import { Registry } from "@allo-team/allo-v2-sdk/";

// // Create a new Registry instance
// export const registry = new Registry({
//   chain: 421614,
//   rpc: "https://arbitrum-sepolia.infura.io/v3/13d58440707f4365b10cada7e86d58ed",
// });

// // NOTE: Update this function to use your own data.
// export const createProfile = async () => {
//   // prepare the arguments -> type comes from the SDK
//   const createProfileArgs: CreateProfileArgs = {
//     // random number to prevent nonce reuse, this is required.
//     // NOTE: The profile ID id based on the provided nonce and the caller's address.
//     nonce: Math.floor(Math.random() * 10000),
//     name: "Allo Workshop",
//     metadata: {
//       protocol: BigInt(1),
//       pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
//     },
//     members: [
//       "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
//       // "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
//     ],
//     owner: "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
//   };

//   console.log("Creating profile with args: ", createProfileArgs);

//   // create the transaction with the arguments -> type comes from SDK
//   // todo: snippet => createProfileTx

//   const txData: TransactionData = await registry.createProfile( createProfileArgs );
//   const gasPriceInGwei = 0.001;
//   const gasPriceInWei = BigInt(gasPriceInGwei * 1e9);

//   try {
//   const txHash = await sendTransaction({
//     to: txData?.to,
//     data: txData?.data,
//     value: BigInt(txData.value),
//     gas: gasPriceInWei,
//   });

//      const receipt =
//        await wagmiConfigData.publicClient.waitForTransactionReceipt({
//          hash: txHash.hash,
//          confirmations: 2,
//        });

//      const profileId =
//        getEventValues(receipt, RegistryABI, "ProfileCreated")?.profileId || "0x";

//      if (profileId === "0x") {
//        throw new Error("Profile creation failed");
//     }

//     return profileId;
//   } catch (error) {
//     console.log("Profile creation error ======>>>",error)
//   }

// };
