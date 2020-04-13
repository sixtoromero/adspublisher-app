import { Observable, Subject } from 'rxjs';
import { map } from "rxjs/operators";

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { ResponseModel } from '../models/response.model';
import { FileModel } from '../models/file.model';

export abstract class BaseService<TModel, TMasterModel>{
    public headers: HttpHeaders;
    token: string;

    public responseModel: ResponseModel<any>;
    public _apiRootLocal: string;

    constructor(protected _httpClient: HttpClient,
        protected _apiRoot: string = environment.apiGatewayURL) {
            this.responseModel = new ResponseModel;
            this._apiRootLocal = environment.apiGatewayURL;
    }

    ApplicationAut(isAut:boolean) {

        if (isAut) {
            this.headers = new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
                'Authorization': "bearer " + this.token
            });

        } else {
            this.headers = new HttpHeaders({
                'Access-Control-Allow-Origin': '*'
            });
        }
    }

    get(endPoint: string, isAut: boolean=false, _token: string): Observable<ResponseModel<TModel>> {
        
        
        const apiURL = `${this._apiRoot}${endPoint}`;
        this.token = _token;
        
        this.ApplicationAut(isAut);

        return this._httpClient.get(apiURL, { headers: this.headers })
        .pipe(
            map(
                (resp: ResponseModel<TModel>) =>{
                    
                    this.responseModel.Data = resp.Data;
                    this.responseModel.IsSuccess = resp.IsSuccess;
                    this.responseModel.Message = resp.Message;

                    return this.responseModel;
        }));
    }

    getfile(endPoint: string): Observable<ResponseModel<TModel>> {

        const apiURL = endPoint;
        
        return this._httpClient.get(apiURL)
        .pipe(
            map(
                (resp: ResponseModel<TModel>) =>{
                    
                this.responseModel.Data = resp;
                this.responseModel.IsSuccess = true;
                this.responseModel.Message = '';

                return this.responseModel;
        }));
    }
    

    getAll(endPoint: string, isAut: boolean=false, _token: string): Observable<ResponseModel<TModel[]>> {

        const apiURL = `${this._apiRoot}${endPoint}`;
        this.token = _token;
        
        this.ApplicationAut(isAut);

        return this._httpClient.get(apiURL, { headers: this.headers })
        .pipe(
            map(
                (resp: ResponseModel<TModel>) =>{
                    
                    this.responseModel.Data = resp.Data;
                    this.responseModel.IsSuccess = resp.IsSuccess;
                    this.responseModel.Message = resp.Message;

                    return this.responseModel;
                }));
    }

    create(endPoint: string, isAut: boolean=false, object: TModel, _token: string): Observable<ResponseModel<TModel>> {
        
        const apiURL = `${this._apiRoot}${endPoint}`;
        this.token = _token;
        this.ApplicationAut(isAut);

        return this._httpClient.post(apiURL, object, { headers: this.headers })
        .pipe(
            map(
                (resp: ResponseModel<TModel>) => {
                    
                    this.responseModel.Data = resp.Data;
                    this.responseModel.IsSuccess = resp.IsSuccess;
                    this.responseModel.Message = resp.Message;

                    return this.responseModel;
                }));
    }

    post(endPoint: string, object: TModel, token: string = ""): Observable<ResponseModel<TModel[]>> {
        
        if (token != "") {
            this.token = token;
            this.ApplicationAut(true);
        }

        const apiURL = `${this._apiRoot}${endPoint}`;
        
        return this._httpClient.post(apiURL, object, { headers: this.headers })
        .pipe(
            map(
                (resp: ResponseModel<TModel>) => {
                
                this.responseModel.Data = resp.Data;
                this.responseModel.IsSuccess = resp.IsSuccess;
                this.responseModel.Message = resp.Message;

                return this.responseModel;
            }));
    }

    update(endPoint: string, object: TModel, token: string): Observable<ResponseModel<TModel>> {
        
        if (token != "") {
            this.token = token;
            this.ApplicationAut(true);
        }

        const apiURL = `${this._apiRoot}${endPoint}`;
        
        return this._httpClient.post(apiURL, object, { headers: this.headers })
        .pipe(
            map(
                (resp: ResponseModel<TModel>) =>{

                    this.responseModel.Data = resp.Data;
                    this.responseModel.IsSuccess = resp.IsSuccess;
                    this.responseModel.Message = resp.Message;

                    return this.responseModel;

                }));
    }

    saveMultipleFiles(endPoint: string, fileRequestModel: Array<FileModel>): Observable<ResponseModel<string>> {
        const apiURL = `${this._apiRoot}${endPoint}`;
        return this._httpClient.post(apiURL, fileRequestModel, { headers: this.headers })
        .pipe(
            map(
                (resp: ResponseModel<string>) =>{
                    
                    this.responseModel.Data = resp.Data;
                    this.responseModel.IsSuccess = resp.IsSuccess;
                    this.responseModel.Message = resp.Message;

                    return this.responseModel;
                }));
    }

    private convertToJSON(object: any) {
        return JSON.stringify(object);
    }

    delete(endPoint: string, ID: number, token: string = ""): Observable<ResponseModel<TModel[]>> {
        
        if (token != "") {
            this.token = token;
            this.ApplicationAut(true);
        }

        const apiURL = `${this._apiRoot}${endPoint}`;
        
        /*
        const options = {
            headers: this.headers,
            body: {
              ID
            }
          }*/

        const options = {
            headers: this.headers
          }

          //`${this.baseUrl}/${id}`

        //return this._httpClient.delete(apiURL + "/" + ID, options)
        return this._httpClient.delete(`${apiURL}/${ID}`, options)
        .pipe(
            map(
                (resp: ResponseModel<TModel>) => {
                
                this.responseModel.Data = resp.Data;
                this.responseModel.IsSuccess = resp.IsSuccess;
                this.responseModel.Message = resp.Message;

                return this.responseModel;
            }));
    }

}