// import { delay, fork, take, call, put } from "redux-saga/effects";
// import { authActions, loginPayLoad } from "./authSlice";
// import { PayloadAction } from "@reduxjs/toolkit";
// import { signIn } from 'next-auth/react'




// function* handleLogin(payload: loginPayLoad) {
//     console.log("Handle login");
//     try {
//         yield put(authActions.loginSuccess({
//             sessionStatus: "authenticated",
//         }))
//         yield call(signIn, 'google', {
//             redirect: false,
//             callbackUrl: "/home"
//         });
//     } catch {
//         yield put(authActions.loginFailed("Login Failed"));
//     }

// }
// function* handleLogout() {
//     console.log("handle logout");
//     yield delay(100);
// }



// function* watchLoginFlow() {

//     var i = 0;
//     while (i < 10) {
//         const checkSessionStatus = localStorage.getItem("access_token")
//         console.log("Watch Login");
//         console.log(checkSessionStatus);
//         if (checkSessionStatus === "unauthenticated") {
//             const action: PayloadAction<loginPayLoad> = yield take(authActions.loginSocial.type);
//             yield fork(handleLogin, action.payload);
//         }
//         if (checkSessionStatus === "authenticated") {
//             yield take(authActions.logout.type);
//             yield call(handleLogout);
//         }
//         i++;
//     }


// }

// export default function* authSaga() {
//     yield watchLoginFlow();
//     console.log('Auth Saga');
// }