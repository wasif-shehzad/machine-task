import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
// const token = localStorage.getItem("token");
import api from "../../api";

const initialState = {
  userData: null,
  token: null,
  initialize: false,
  userList: null,
};

export const logIn = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("user/login", data);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getUsers = createAsyncThunk(
  "user/getAllUsers",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("user/getAll", data);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getAllFiles = createAsyncThunk(
  "user/getAllFiles",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("user/file/getAll", {});
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const editFilePermission = createAsyncThunk(
  "user/editFilePermission",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("user/file/editFilePermissions", data);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const uploadFile = createAsyncThunk(
  "user/fileUpload",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("user/file/uploadFile", data);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const checkFilePermission = createAsyncThunk(
  "user/viewFilePermission",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("user/file/checkfilepermission", data);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const viewFile = createAsyncThunk(
  "user/viewFile",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("user/file/viewFile", data, {
        responseType: "blob",
      });
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const signUp = createAsyncThunk(
  "user/signUp",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("user/signUp", data);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const verifyUserToken = createAsyncThunk(
  "user/verifytoken",
  async (token, { rejectWithValue }) => {
    try {
      return await api.post("auth/verify-token");
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const counterSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: {
    [logIn.fulfilled]: (state, action) => {
      const { user } = action.payload.data.data;
      const { token } = action.payload.data;
      if (user && token) {
        localStorage.setItem("token", token);
        state.userData = user;
        state.token = token;
        state.initialize = true;
      }
    },
    [logIn.rejected]: (state, action) => {
      console.log("Login Request Rejected");
    },
    [verifyUserToken.fulfilled]: (state, action) => {
      const { data } = action.payload.data;

      state.userData = data;
      state.initialize = true;
      state.token = localStorage.getItem("token");
    },
    [verifyUserToken.rejected]: (state, action) => {
      console.log("Creator token Request Rejected");
      // localStorage.removeItem("token");
      state.userData = null;
      state.token = null;
      state.initialize = true;
    },
  },
});

export default counterSlice.reducer;
