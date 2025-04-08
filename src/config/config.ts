export const FREELANCER_ADDRESS = process.env.NEXT_PUBLIC_FREELANCER_ADDRESS;
export const CLIENT_ADDRESS = process.env.NEXT_PUBLIC_CLIENT_ADDRESS;
// eas-sdk config
export const EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // SEPOLIA Version 0.26
export const SCHEMA_REGISTRY_ADDRESS =
  "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia
export const SCHEMA =
  "string signalGenerationDate, string entryPrice, string coinId, string tp1, string tp2, string sl, string exitPrice, string pnl, string reasoning";
export const SCHEMA_DETAILS = {
  schemaName: "Trade Signal Attestation",
  signalGenerationDate:
    "string (ISO 8601 timestamp of when the trade signal was generated)",
  entryPrice: "string (entry price of the token at the time of the signal)",
  coinId: "string (identifier of the token, e.g., 'bitcoin')",
  tp1: "string (first take-profit price level)",
  tp2: "string (second take-profit price level)",
  sl: "string (stop-loss price level)",
  exitPrice: "string (final exit price of the trade)",
  pnl: "string (profit and loss percentage, e.g., '3.21%')",
  reasoning: "string (explanation of why the trade strategy was chosen)",
};
