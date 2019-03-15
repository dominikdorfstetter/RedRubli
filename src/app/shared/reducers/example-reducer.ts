import * as Class from '../actions/example-actions';

export interface State {
    data: {};
}

const initialState: State = {
    data: {}
};

export function reducer(state = initialState, action: Class.ClassActions ): State {
    switch (action.type) {
        case Class.ClassActionTypes.Verb1: {
            return {
                ...state,
                data: action.payload
            };
        }

        default: {
            return state;
        }
    }
}
