import { ErrorBase } from "../../../libraries/error/error"

type ErrorName = 
    | "IMG_FILE_NOT_EXIST_ERROR"

export class ReceiptServiceError extends ErrorBase<ErrorName> {}

export function imgFileNotExistError(imgPath: string): ReceiptServiceError {
    return new ReceiptServiceError({
        name: "IMG_FILE_NOT_EXIST_ERROR",
        message: "no file exists at <" + imgPath + ">",
    })
}
