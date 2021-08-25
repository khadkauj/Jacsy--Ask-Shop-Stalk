import { createSlice } from "@reduxjs/toolkit";

// here counter is a layer
// such layer are called Slice of the Store
// such slices are created using createSlice
export const userSlice = createSlice({
  // and the slice has a name called counter
  name: "user",
  // who has a initial state
  initialState: {
    // and initial value
    // username: null,
    // photourl: "",
    // email: "",
    // uid: "",
    // emailVerified: "",
    pack: []
  },
  // and here we describe the reducer
  // Reducers are functions that take the current state
  //  and an action as arguments, and return a new state
  // result. In other words, (state, action) => newState.
  // here, increment, decrement and incerementByAmount
  // are reducer functions
  reducers: {
    setUsername: (state, action) => {
      // state.username = action.payload.username;
      // state.photourl = action.payload.photourl;
      // state.email = action.payload.email;
      // state.uid = action.payload.uid
      // state.emailVerified = action.payload.emailVerified
      state.pack = action.payload.pack
    },
    logout: (state) => {
      // state.username = null;
      // state.photourl = null;
      // state.email = null;
      // state.uid = null
      state.pack = []
    },

  },
});

// and we basically export this to counterSlice.actions
export const { setUsername, logout } = userSlice.actions;

// 
// export const selectUser = (state) => state.user.username;
// export const selectPhotourl = (state) => state.user.photourl;
// export const selectEmail = (state) => state.user.email;
// export const selectUid = (state) => state.user.uid;
// export const emailVerified = (state) => state.user.emailVerified
export const selectPack = (state) => state.user.pack




export default userSlice.reducer;
