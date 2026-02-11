// src/features/rawMaterials/rawMaterialSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rawMaterialService } from './rawMaterialService';
import { toast } from "react-hot-toast";

const initialState = {
  rawMaterials: [],
  loading: false,
  status: "idle",
  error: null,
};

// Async Thunks do Redux

export const fetchRawMaterials = createAsyncThunk(
  "rawMaterials/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await rawMaterialService.getAllRawMaterials();
    } catch (error) {
      toast.error("Failed to load rawMaterials");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching rawMaterials"
      );
    }
  }
);

export const createRawMaterial = createAsyncThunk(
  "rawMaterials/create",
  async (rawMaterial, thunkAPI) => {
    try {
      const created = await rawMaterialService.createRawMaterial(rawMaterial);
      toast.success("rawMaterial created successfully!");
      return created;
    } catch (error) {
      toast.error("Error creating rawMaterial");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error creating rawMaterial"
      );
    }
  }
);

export const updateRawMaterial = createAsyncThunk(
  "rawMaterials/update",
  async ({ id, rawMaterial }, thunkAPI) => {
    try {
      const updated = await rawMaterialService.updateRawMaterial(id, rawMaterial);
      toast.success("rawMaterial updated!");
      return updated;
    } catch (error) {
      toast.error("Error updating rawMaterial");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating rawMaterial"
      );
    }
  }
);

export const deleteRawMaterial = createAsyncThunk(
  "rawMaterials/delete",
  async (id, thunkAPI) => {
    try {
      await rawMaterialService.deleteRawMaterial(id);
      toast.success("rawMaterial deleted!");
      return id;
    } catch (error) {
      toast.error("Error deleting rawMaterial");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting rawMaterial"
      );
    }
  }
);

// Slice do Redux
const rawMaterialSlice = createSlice({
  name: 'rawMaterials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.rawMaterials = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.rawMaterials.push(action.payload);
      })

      // UPDATE
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const index = state.rawMaterials.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.rawMaterials[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.rawMaterials = state.rawMaterials.filter(m => m.id !== action.payload);
      });
  },
});

export const { clearError } = rawMaterialSlice.actions;
export default rawMaterialSlice.reducer;
