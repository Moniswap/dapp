import client from "@/configs/api/client";
import { __CHAIN_IDS__ } from "@/constants";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
}

interface TokensState {
  [chainId: number]: {
    tokenlist: TokenInfo[];
    firstSelectedToken: string;
    secondSelectedToken: string;
  };
}

const initialState: TokensState = (() => {
  const tState: TokensState = {};

  Object.values(__CHAIN_IDS__).forEach(value => {
    tState[value] = {
      tokenlist: [],
      firstSelectedToken: "0x",
      secondSelectedToken: "0x"
    };
  });

  return tState;
})();

export const loadTokenList = createAsyncThunk("Tokenlist/load", async (chainId: number) => {
  try {
    const res = await client.get<{ result: TokenInfo[] }>(`/tokenlist/${chainId}`);
    return res.data.result;
  } catch (error: any) {
    return [];
  }
});

const tokensSlice = createSlice({
  initialState,
  name: "Tokenlist",
  reducers: {
    setFirstSelectedToken: (state, action: PayloadAction<{ chainId: number; address: string }>) => {
      state[action.payload.chainId] = {
        ...state[action.payload.chainId],
        firstSelectedToken: action.payload.address
      };
    },
    setSecondSelectedToken: (state, action: PayloadAction<{ chainId: number; address: string }>) => {
      state[action.payload.chainId] = {
        ...state[action.payload.chainId],
        secondSelectedToken: action.payload.address
      };
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadTokenList.fulfilled, (state, action) => {
        state[action.meta.arg] = {
          tokenlist: action.payload,
          firstSelectedToken: action.payload[0].address,
          secondSelectedToken: action.payload[1].address
        };
      })
      .addCase(loadTokenList.rejected, (state, action) => {
        state[action.meta.arg] = {
          tokenlist: [],
          firstSelectedToken: "0x",
          secondSelectedToken: "0x"
        };
      });
  }
});

export const { setFirstSelectedToken, setSecondSelectedToken } = tokensSlice.actions;
export default tokensSlice.reducer;
