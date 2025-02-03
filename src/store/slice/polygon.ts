import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Polygon, PolygonState } from "@/types/store";

const initialState: PolygonState = {
  polygons: [],
};

export const polygonSlice = createSlice({
  name: "polygons",
  initialState,

  reducers: {
    addPolygon: (state, action: PayloadAction<Polygon>) => {
      state.polygons.push(action.payload);
    },
    updatePolygon: (state, action: PayloadAction<Polygon>) => {
      const index = state.polygons.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.polygons[index] = action.payload;
      }
    },
    deletePolygon: (state, action: PayloadAction<string>) => {
      state.polygons = state.polygons.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addPolygon, updatePolygon, deletePolygon } =
  polygonSlice.actions;

export default polygonSlice.reducer;
