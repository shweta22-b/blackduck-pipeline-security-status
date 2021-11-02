import { IBlackDuckToken } from '../src/models/IBlackDuckToken';
import versionData from './__mocks__/mockVersionData.json';
import projectData from './__mocks__/mockProjectData.json'
import { IRequestOptions } from '../src/models/IRequestOptions';
import { blackduckCheck } from '../src/services/BlackDuckCheck';
import { IBlackDuckProject } from '../src/models/IBlackDuckProject';
import { DetectADOConstants } from '../src/lib/BlackDuckConstants'
import manswer = require('azure-pipelines-task-lib/mock-answer');
import trunner = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

const taskPath = path.join(__dirname, '..', 'index.js');
let taskrunner: trunner.TaskMockRunner = new trunner.TaskMockRunner(taskPath);

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
const serviceConnectionId = 'blackduckserviceconnection'
taskrunner.setInput("blackduckconnection", serviceConnectionId);
taskrunner.setInput("projectName", "Test-Project");
taskrunner.setInput("versionName", "Test-Version");

taskrunner.run();



test('Should return true when looking for HIGH license risks', async () => {
    const licenseRisks = versionData.items[0].licenseRiskProfile.counts;
    expect(await blackduckCheck.checkViolations(licenseRisks)).toEqual(true);
})

test('Should return true when looking for CRITICAL security risks', async () => {
    const securityRisks = versionData.items[0].securityRiskProfile.counts;
    expect(await blackduckCheck.checkViolations(securityRisks)).toEqual(true);
})