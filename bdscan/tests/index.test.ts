import { IBlackDuckToken } from '../src/models/IBlackDuckToken';
import { IRequestOptions } from '../src/models/IRequestOptions';
import { mockProjectResponse, mockVersionResponse } from './__mocks__/mockReturnData'
import https from 'https';
import { blackduckCheck } from '../src/services/BlackDuckCheck';
import { IBlackDuckProject } from '../src/models/IBlackDuckProject';

let mockBlackDuckToken: IBlackDuckToken = {
    bearerToken: "123456abc",
    expiresInMilliseconds: 12345678
};

let mockOption: IRequestOptions = {
    headers: {
        'Authorization': 'Bearer 123ABCabc',
        'Accept': 'bd-json-data'
    }
}

let mockUrl = "https://localhost/api/";
