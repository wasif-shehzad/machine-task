import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers";
import thunk from "redux-thunk";
export let store = createStore(rootReducer, applyMiddleware(thunk));
// export let persistor = persistStore(store);
