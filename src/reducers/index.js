import loadingReducer from './isLoading';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    isLoading: loadingReducer
});

export default allReducers;