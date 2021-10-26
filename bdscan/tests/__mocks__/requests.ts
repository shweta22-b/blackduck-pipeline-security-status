import { IRequestOptions } from "../../src/models/IRequestOptions";

export async function getRequest (options: IRequestOptions, mockResponse: any): Promise<any> {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            let mockBearer = options.headers.Authorization ? options.headers.Authorization : reject({
                error: 'Bearer token not found'
            });
            let body;
            let response;
            try{
                body = JSON.stringify(mockResponse);
                response = JSON.parse(body);
            }
            catch (error){
                reject(error);
            }
            resolve(response)
        });
    });
}