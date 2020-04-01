export class ResponseModel<T> {
    public Data: T;
    public IsSuccess: boolean;
    public Message: string;
}