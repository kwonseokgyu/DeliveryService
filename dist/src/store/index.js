import { configureStore, createSlice } from "@reduxjs/toolkit";

// 1️⃣ Slice 정의
const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    records: [],
  },
  reducers: {
    setRecords(state, action) {
      state.records = action.payload;
    },
    addRecord(state, action) {
      state.records.push(action.payload);
    },
    updateRecord(state, action) {
      const index = state.records.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteRecord(state, action) {
      state.records = state.records.filter((r) => r.id !== action.payload);
    },
    resetRecords(state) {
      state.records = [];
    },
  },
});

// 2️⃣ store 생성
const store = configureStore({
  reducer: {
    delivery: deliverySlice.reducer,
  },
});

// 3️⃣ export
export const {
  setRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  resetRecords,
} = deliverySlice.actions;

export default store;
