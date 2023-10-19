import { Action, configureStore, ThunkAction, Middleware, combineReducers, PayloadAction } from "@reduxjs/toolkit";

import walletReducer, { WalletState } from "./walletSlice";
import { debounce } from "rambdax";

const version = 1.3;

const saveState = (state: any) => {
  try {
    const stateString = JSON.stringify(state);
    window.localStorage["rpsls-store"] = stateString;
  } catch (err) {
    console.log("Error saving state", err);
  }
};

const debouncedSaveState = debounce(saveState, 250); // Adjust the delay (in milliseconds) as needed

const saver: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  debouncedSaveState(store.getState());
  return result;
};

if (typeof window !== "undefined") {
  let savedVersion = window.localStorage.getItem("version");
  if (!savedVersion) {
    window.localStorage.setItem("version", version.toString());
  }

  savedVersion = window.localStorage.getItem("version");

  if (Number(savedVersion) !== version) {
    window.localStorage.removeItem("rpsls-store");
    window.localStorage.setItem("version", version.toString());
  }
}

// Define your action type
const HYDRATE = "HYDRATE";

// Define your action creator
export const hydrate = (newState: any) => ({ type: HYDRATE, payload: newState });

type RootState = {
  wallet: WalletState;
};

// Define a special hydrating root reducer
const rootReducer = (state: RootState | undefined, action: PayloadAction<RootState>) => {
  if (action.type === HYDRATE) {
    return action.payload;
  } else {
    return combineReducers({
      wallet: walletReducer,
    })(state, action);
  }
};

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saver),
    devTools: process.env.NODE_ENV !== "production",
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export default store;
