import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { type } from "os";


type InitialState = {
    value: AuthState;

}

type AuthState = {
    isAuth: boolean,
    username: string,
    uid: string,
    isModerator: boolean,
};

const initialState = {
    value: {
        isAuth: false,
        username: "",
        uid: "",
        isModerator: false,
    } as AuthState,
} as InitialState;

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {

    }
});