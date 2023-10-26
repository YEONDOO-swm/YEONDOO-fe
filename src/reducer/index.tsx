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
    secondPaper: {
        paperId: string;
        paperTitle: string;
    }
    papersInStorage: Paper[];
    chatSelected: {
        selectedText: string;
        position: {
            pageIndex: number;
            rects: number[][]
        }
    };
    annotations: any;
    summaryAnswer: {
        mermaid: boolean;
        answer: string;
    };
    isUpdatedDone: boolean;
    userPdfList: {
        paperId: string;
        title: string;
        url: string;
    }[]
};

export const SET_API = "SET_API"
export const SET_IS_OPEN_SELECT_REF = "SET_IS_OPEN_SELECT_REF"
export const SET_REF_PAPER = "SET_REF_PAPER"
export const SET_SECOND_PAPER = "SET_SECOND_PAPER"
export const SET_PAPERS_IN_STORAGE = "SET_PAPERS_IN_STORAGE"
export const SET_CHAT_SELECTED = "SET_CHAT_SELECTED"
export const SET_ANNOTATIONS = "SET_ANNOTATIONS"
export const SET_SUMMARY_ANSWER = "SET_SUMMARY_ANSWER"
export const SET_IS_UPDATED_DONE = "SET_IS_UPDATED_DONE"
export const SET_USER_PDF_LIST = "SET_USER_PDF_LIST"

const initState = {
    api: '',
    isOpenSelectRef: false,
    refPaper: {
        paperId: "",
        paperTitle: "",
    },
    papersInStorage: [],
    chatSelected: {
        selectedText: "",
        position: {
            pageIndex: 0,
            rects: []
        }
    },
    annotations: null,
    summaryAnswer: {
        mermaid: false,
        answer: "",
    },
    secondPaper: {
        paperId: "",
        paperTitle: "",
    },
    isUpdatedDone: false,
    userPdfList: [],
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
        case SET_CHAT_SELECTED:
            return {
                ...state,
                chatSelected: action.data
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
        case SET_SECOND_PAPER:
            return {
                ...state,
                secondPaper: action.data
            }
        case SET_IS_UPDATED_DONE:
            return {
                ...state,
                isUpdatedDone: action.data
            }
        case SET_USER_PDF_LIST:
            return {
                ...state,
                userPdfList: [...state.userPdfList, action.data]
            }
        default:
            return state;
    }
}