import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from './productService';
import { toast } from "react-hot-toast";


const initialState = {
  products: [],
  loading: false,
  status: "idle",
  error: null,
};

// Async thunk do Redux
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await productService.getAllProducts();
    } catch (error) {
      toast.error("Failed to load products");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching products"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (payload, thunkAPI) => {
    try {
      const data = await productService.createProduct(payload);
      toast.success("Product created");
      return data;
    } catch (error) {
      if (error.response?.status === 409) {
        // Mostra o aviso bonitinho que o código já existe
        toast.error(error.response.data.error || "Product code already exists");
      } else {
        toast.error("Error creating product");
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error creating product"
      );
    }
  }
);



export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, product }, thunkAPI) => {
    try {
      const data = await productService.updateProduct(id, product);
      toast.success("Product updated");
      return data;
    } catch (error) {
      toast.error("Error updating product");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating product"
      );
    }
  }
);


export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted");
      return id;
    } catch (error) {
      toast.error("Error deleting product");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting product"
      );
    }
  }
);


// Slice do Redux
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null; //antes da chamada
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.status = "succeeded"; //sucesso
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; //erro
      })

      // CREATE
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;

