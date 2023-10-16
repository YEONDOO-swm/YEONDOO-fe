type Paper = {
    title: string;
    paperId: string;
    authors: string[];
    year: number;
    conference?: string;
    cites?: number;
    url: string;
  }

export type CounterState = {
    api: string;
    isOpenSelectRef: boolean;
    refPaper: {
        paperId: string;
        paperTitle: string;
    },
    papersInStorage: Paper[];
    chatSelectedText: string;
    annotations: any;
    summaryAnswer: string;
};

export const SET_API = "SET_API"
export const SET_IS_OPEN_SELECT_REF = "SET_IS_OPEN_SELECT_REF"
export const SET_REF_PAPER = "SET_REF_PAPER"
export const SET_PAPERS_IN_STORAGE = "SET_PAPERS_IN_STORAGE"
export const SET_CHAT_SELECTED_TEXT = "SET_CHAT_SELECTED_TEXT"
export const SET_ANNOTATIONS = "SET_ANNOTATIONS"
export const SET_SUMMARY_ANSWER = "SET_SUMMARY_ANSWER"

const initState = {
    api: '',
    isOpenSelectRef: false,
    refPaper: {
        paperId: "",
        paperTitle: "",
    },
    papersInStorage: [],
    chatSelectedText: "",
    annotations: null,
    summaryAnswer: ""
}

export const reducer = (state:CounterState = initState, action:any) => {
    switch (action.type) {
        case SET_API:
            return {
                ...state,
                api: action.data
            }
        case SET_IS_OPEN_SELECT_REF:
            return {
                ...state,
                isOpenSelectRef: action.data
            }
        case SET_REF_PAPER:
            return {
                ...state,
                refPaper: action.data
            }
        case SET_PAPERS_IN_STORAGE:
            return {
                ...state,
                papersInStorage: action.data
            }
        case SET_CHAT_SELECTED_TEXT:
            return {
                ...state,
                chatSelectedText: action.data
            }
        case SET_ANNOTATIONS:
            return {
                ...state,
                annotations: action.data
            }
        case SET_SUMMARY_ANSWER:
            return {
                ...state,
                summaryAnswer: action.data
            }
        default:
            return state;
    }
}