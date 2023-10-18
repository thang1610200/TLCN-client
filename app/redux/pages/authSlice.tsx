import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface loginPayLoad {
    sessionStatus: string;
}


type InitialState = {
    value: AuthState;
}

type AuthState = {
    isLogging: boolean,
    isLoading: boolean,
    sessionStatus?: String,
};

const initialState: AuthState = {
    isLogging: false,
    isLoading: false,
    sessionStatus: undefined,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSocial(state) {
            state.isLoading = true;
        },
        loginSuccess(state, action: PayloadAction<loginPayLoad>) {
            state.isLogging = true;
            state.isLoading = false

        },
        loginFailed(state, action: PayloadAction<string>) {
            state.isLoading = false;
        },

        logout(state) {
            state.isLogging = false;
            state.sessionStatus = undefined;
        },
    }
});


//action
export const authActions = authSlice.actions;

//selector
export const selectIsLogging = (state: any) => state.auth.isLogging;
export const selectIsLoading = (state: any) => state.auth.isLoading;

//reducer
const authReducer = authSlice.reducer;
export default authReducer;
