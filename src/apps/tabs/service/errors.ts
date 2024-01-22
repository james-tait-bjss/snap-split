import { ErrorBase } from "../../../libraries/error/error"

// TODO: USE ENUM
type ErrorName = 
    | "TAB_NOT_EXIST_ERROR"
    | "USER_NOT_EXIST_ERROR"
    | "USER_ALREADY_EXISTS_ERROR"

export class TabServiceError extends ErrorBase<ErrorName> {}

export function tabNotExistError(tabID: string): TabServiceError {
    return new TabServiceError({
        name: "TAB_NOT_EXIST_ERROR",
        message: "tab <" + tabID + "> does not exist",
    })
}

export function userNotExistError(userID: string, tabID: string): TabServiceError {
    return new TabServiceError({
        name: "USER_NOT_EXIST_ERROR",
        message: "user <" + userID + "> does not exist in tab <" + tabID + ">",
    })
}

export function userAlreadyExistsError(userID: string, tabID: string): TabServiceError {
    return new TabServiceError({
        name: "USER_ALREADY_EXISTS_ERROR",
        message: "user <" + userID + "> already exists in tab <" + tabID + ">",
    })
}