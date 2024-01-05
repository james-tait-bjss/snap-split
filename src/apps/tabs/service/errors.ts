import { ErrorBase } from "../../../libraries/error/error";

// TODO: USE ENUM
type ErrorName = 
    | "TAB_NOT_EXIST_ERROR"

export class TabServiceError extends ErrorBase<ErrorName> { }

export function tabNotExistError(tabID: string): TabServiceError {
    return new TabServiceError({
        name: "TAB_NOT_EXIST_ERROR",
        message: "tab <" + tabID + "> does not exist"
    }) 
}