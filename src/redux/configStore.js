import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit"
import { createBrowserHistory } from "history";
import dictionary from "./module/dictionary";
// 리듀스 관리용 로거를 추가
import {createLogger} from "redux-logger"
const logger = createLogger();

export const history = createBrowserHistory();

const rootReducer = combineReducers({ dictionary });

// redux 버전 4.2.0를 사용 중이며 creatStore는 더이상 사용되지 않음으로 configureStore로 변경
const store =  configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});


export default store;
