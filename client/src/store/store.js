import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import profileReducer from './slices/ProfileSlice';
import notificationReducer from './slices/notificationSlice';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

const rootReducer = combineReducers({
    auth: authReducer,
    posts : postReducer,
    profile : profileReducer,
    notifications : notificationReducer,

})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth','posts'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], 
      },
    }),
});

export const persistor = persistStore(store);