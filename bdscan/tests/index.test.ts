import { IBlackDuckToken } from '../src/models/IBlackDuckToken';
import versionData from './__mocks__/mockVersionData.json';
import projectData from './__mocks__/mockProjectData.json'
import { IRequestOptions } from '../src/models/IRequestOptions';
import { BlackDuckCheck } from '../src/services/BlackDuckCheck';
import { IBlackDuckProject } from '../src/models/IBlackDuckProject';
import { DetectADOConstants } from '../src/lib/BlackDuckConstants'
import manswer = require('azure-pipelines-task-lib/mock-answer');
import trunner = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import { getEndpointAuthorization } from 'azure-pipelines-task-lib';

const taskPath = path.join(__dirname, '..', 'index.js');
let taskrunner: trunner.TaskMockRunner = new trunner.TaskMockRunner(taskPath);

let mockBlackDuckToken: IBlackDuckToken = {
    bearerToken: "123456abc",
    expiresInMilliseconds: 12345678
};

let mockBlackDuckAPIToken = "123456abc";

let mockOption: IRequestOptions = {
    headers: {
        'Authorization': 'Bearer 123ABCabc',
        'Accept': 'bd-json-data'
    }
}
/* TODO Mock the Task Functions */
// const serviceConnectionId = {Endpoint: 'mockendpoint.mockurl'};

// process.env.ENDPOINT_AUTH_SYSTEMVVSSCONNECTION="serviceConnectionId";
// process.env.ENDPOINT_AUTH_SCHEME_SYSTEMVSSCONNECTION ="serviceConnectionId";
// process.env.ENDPOINT_AUTH_PARAMETER_SYSTEMVSSCONNECTION_ACCESSTOKEN="fakeaccesstoken";

// taskrunner.setInput("blackduckconnection", 'serviceConnectionId');
// taskrunner.setInput("projectName", "Test-Project");
// taskrunner.setInput("versionName", "Test-Version");
// taskrunner.run();

describe('Black Duck Checks', () => {
    let blackduckCheck = new BlackDuckCheck(mockBlackDuckAPIToken, "Test-Project", "Test-Version", "mockurl.mockurl");

    test('Should instantiate an object', () => {
        expect (blackduckCheck).toBeTruthy();
    })

    test('Should return true when looking for HIGH license risks', async () => {
        const licenseRisks = versionData.items[0].licenseRiskProfile.counts;
        expect(await blackduckCheck.checkViolations(licenseRisks)).toEqual(true);
    })

    test('Should return true when looking for CRITICAL security risks', async () => {
        const securityRisks = versionData.items[0].securityRiskProfile.counts;
        expect(await blackduckCheck.checkViolations(securityRisks)).toEqual(true);
    })
})

