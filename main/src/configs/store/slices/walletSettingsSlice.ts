import { __CHAIN_IDS__, __RPCS__ } from "@/constants";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RPCNodeState {
  [key: number]: {
    serviceName: string;
    url: string;
  };
}

interface WalletSettingsSliceInterface {
  slippageTolerance: number;
  executionDeadlineInMinutes: number;
  rpcNode: RPCNodeState;
  allowUnsafeTrades: boolean;
}

const initialState: WalletSettingsSliceInterface = {
  slippageTolerance: 0.01,
  executionDeadlineInMinutes: 20,
  allowUnsafeTrades: false,
  rpcNode: (() => {
    let state: RPCNodeState = {};

    const derived = Object.values(__CHAIN_IDS__).map(val => ({
      [val]: __RPCS__[val][0]
    }));

    derived.forEach(val => {
      state = { ...state, ...val };
    });

    return state;
  })()
};

const createWalletSettingsSlice = createSlice({
  name: "Wallet Settings",
  initialState,
  reducers: {
    changeSlippageTolerance: (state, action: PayloadAction<number>) => {
      state.slippageTolerance = action.payload;
    },
    changeExecutionDeadlineInMinutes: (state, action: PayloadAction<number>) => {
      state.executionDeadlineInMinutes = action.payload;
    },
    changeAllowUnsafeTrades: (state, action: PayloadAction<boolean>) => {
      state.allowUnsafeTrades = action.payload;
    },
    changeRPCNodeUrl: (state, action: PayloadAction<{ chainId: number; value: string }>) => {
      state.rpcNode[action.payload.chainId].url = action.payload.value;
    }
  }
});

export const { changeAllowUnsafeTrades, changeSlippageTolerance, changeExecutionDeadlineInMinutes, changeRPCNodeUrl } =
  createWalletSettingsSlice.actions;
export default createWalletSettingsSlice.reducer;
