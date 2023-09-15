export type CounterState = {
    api: string;
};

export const SET_API = "SET_API"

const initState = {
    api: ''
}

export const reducer = (state:CounterState = initState, action:any) => {
    switch (action.type) {
        case SET_API:
            return {
                ...state,
                api: action.data
            }
        default:
            return state;
    }
}