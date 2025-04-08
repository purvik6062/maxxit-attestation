"use client";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useState } from "react";
import { SCHEMA, SCHEMA_DETAILS } from "../config/config";
import { useEAS } from "../hooks/useEAS";

type AttestationData = {
  signalGenerationDate: string;
  entryPrice: string;
  coinId: string;
  tp1: string;
  tp2: string;
  sl: string;
  exitPrice: string;
  pnl: string;
  reasoning: string;
};

/** @dev AFTER REGISTERING A SCHEMA, OR MAKING AN ATTESTATION
 * IF YOU REFRESH APP MAKE SURE TO PASTE IN SCHEMA/ATTESTATIONUID IN STATE VARIABLES OR ELSE APP WONT WORK
 * */
const Attestations = () => {
  const { eas, schemaRegistry, currentAddress } = useEAS();
  //   console.log("currentAddress ", currentAddress);

  // schemaUID is set when the user registers the trade signal schema
  const [schemaUID, setSchemaUID] = useState<string>(
    "0x38a8fa800e220b3455fcb8f40263ee1748fc43147f146e24a4ede5993ffd3f9c"
  );
  const [attestationUID, setAttestationUID] = useState<string>("");

  //   const [schemaUID, setSchemaUID] = useState<string>(
  //     "0x38a8fa800e220b3455fcb8f40263ee1748fc43147f146e24a4ede5993ffd3f9c"
  //   );

  //   const [attestationUID, setAttestationUID] = useState<string>(
  //     "0x4968c28d7e6a01c46c2bc1cfc5edb64a49e94801126c0c0a1d848ed72bd262c9"
  //   );

  const [attestationData, setAttestationData] = useState<AttestationData>({
    signalGenerationDate: "",
    entryPrice: "",
    coinId: "",
    tp1: "",
    tp2: "",
    sl: "",
    exitPrice: "",
    pnl: "",
    reasoning: "",
  });

  const handleAttestationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setAttestationData({
      ...attestationData,
      [name]: value,
    });
  };

  const registerSchema = async () => {
    if (!schemaRegistry) return;
    const transaction = await schemaRegistry.register({
      schema: SCHEMA,
      resolverAddress: undefined,
      revocable: true,
    });
    console.log("transaction ", transaction);
    const uid = await transaction.wait();
    console.log("schemaUID ", uid);
    setSchemaUID(uid);
  };

  const createAttestation = async () => {
    if (!eas || !schemaUID) return;
    const schemaEncoder = new SchemaEncoder(SCHEMA);
    const encodedData = schemaEncoder.encodeData([
      {
        name: "signalGenerationDate",
        value: attestationData.signalGenerationDate,
        type: "string",
      },
      { name: "entryPrice", value: attestationData.entryPrice, type: "string" },
      { name: "coinId", value: attestationData.coinId, type: "string" },
      { name: "tp1", value: attestationData.tp1, type: "string" },
      { name: "tp2", value: attestationData.tp2, type: "string" },
      { name: "sl", value: attestationData.sl, type: "string" },
      { name: "exitPrice", value: attestationData.exitPrice, type: "string" },
      { name: "pnl", value: attestationData.pnl, type: "string" },
      { name: "reasoning", value: attestationData.reasoning, type: "string" },
    ]);

    const transaction = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: currentAddress,
        expirationTime: undefined,
        revocable: true,
        data: encodedData,
      },
    });

    const newAttestationUID = await transaction.wait();
    setAttestationUID(newAttestationUID);

    console.log("New attestation UID:", newAttestationUID);
    console.log("Creating Attestation:", attestationData);
  };

  const revokeAttestation = async () => {
    if (!eas) return;
    const attestation = await eas.getAttestation(attestationUID);

    const transaction = await eas.revoke({
      schema: attestation.schema,
      data: { uid: attestation.uid },
    });
    const receipt = await transaction.wait();
    console.log("Revoking Attestation:", receipt);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ethereum Attestation Service
          </h1>
          <p className="text-gray-600">
            Securely record and verify trade signals on-chain
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {!schemaUID
              ? "Step 1: Register Trade Signal Schema"
              : "Step 2: Create Trade Signal Attestation"}
          </h2>

          {!schemaUID && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Schema Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  {Object.entries(SCHEMA_DETAILS).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium capitalize">{key}:</span>
                      <span className="text-gray-500">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={registerSchema}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Register Schema
              </button>
            </div>
          )}

          {schemaUID && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Signal Generation Date
                  </label>
                  <input
                    type="text"
                    name="signalGenerationDate"
                    onChange={handleAttestationChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Coin ID
                  </label>
                  <input
                    type="text"
                    name="coinId"
                    onChange={handleAttestationChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., bitcoin"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Entry Price
                  </label>
                  <input
                    type="text"
                    name="entryPrice"
                    onChange={handleAttestationChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.000001"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Take Profit 1 (TP1)
                  </label>
                  <input
                    type="text"
                    name="tp1"
                    onChange={handleAttestationChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Take Profit 2 (TP2)
                  </label>
                  <input
                    type="text"
                    name="tp2"
                    onChange={handleAttestationChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stop Loss (SL)
                  </label>
                  <input
                    type="text"
                    name="sl"
                    onChange={handleAttestationChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Exit Price
                  </label>
                  <input
                    type="text"
                    name="exitPrice"
                    onChange={handleAttestationChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.000001"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    PnL (%)
                  </label>
                  <input
                    type="text"
                    name="pnl"
                    onChange={handleAttestationChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trading Rationale
                </label>
                <textarea
                  name="reasoning"
                  onChange={handleAttestationChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed analysis and reasoning for the trade..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={createAttestation}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Attestation
                </button>

                <button
                  onClick={revokeAttestation}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Revoke Attestation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-700 mb-2">Schema Status</h3>
            <p className="text-gray-600 break-all">
              {schemaUID || "No schema registered"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Attestation Status
            </h3>
            <p className="text-gray-600 break-all">
              {attestationUID || "No attestation created"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attestations;
