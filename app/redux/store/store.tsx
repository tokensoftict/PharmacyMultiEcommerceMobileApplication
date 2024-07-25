import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {systemReducer} from "../reducers";

const rootReducer = combineReducers({systemReducer});
export const store = createStore(rootReducer, applyMiddleware(thunk));
