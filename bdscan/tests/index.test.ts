import { IBlackDuckToken } from '../src/models/IBlackDuckToken';
import * as versionData from './__mocks__/mockVersionData.json';
import * as licenseData from './__mocks__/mockLicenseViolationsData.json'
import * as projectData from './__mocks__/mockProjectData.json';
import * as vulnerabilityData from './__mocks__/mockVulnerabilityData.json';
import * as policyData from './__mocks__/mockPolicyViolationsData.json'
import { IRequestOptions } from '../src/models/IRequestOptions';
import { BlackDuckCheck } from '../src/services/BlackDuckCheck';
import { IBlackDuckProject } from '../src/models/IBlackDuckProject';
import { DetectADOConstants } from '../src/lib/BlackDuckConstants'
import * as manswer from 'azure-pipelines-task-lib/mock-answer';
import * as trunner from 'azure-pipelines-task-lib/mock-run';
import * as path from 'path';
import { IBlackDuckVersion } from '../src/models/IBlackDuckVersion';
import { IRiskState } from '../src/models/IRiskState';
import { IBlackDuckViolations } from '../src/models/IBlackDuckViolations';

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

describe('Black Duck Checks', () => {
    let blackduckCheck = new BlackDuckCheck(mockBlackDuckAPIToken, "Test-Project", "Test-Version", "mockurl.mockurl");

    test('Should instantiate an object', () => {
        expect (blackduckCheck).toBeTruthy();
    });

    test('Should return true based off one security exclusion', async () => {
        const vulDataString = JSON.stringify(vulnerabilityData)
        const vulData:IBlackDuckViolations = JSON.parse(vulDataString);
        const mockInputExclusionString = "aspnet/AspNetCore";
        const mockExclusionArray = mockInputExclusionString.length > 0 ? mockInputExclusionString.split(', ') : [];
        const mockSecRisks: IRiskState[] = await blackduckCheck.checkExclusions(mockExclusionArray, vulData.items, vulData.totalCount, "security");
        const mappedRisks = mockSecRisks.map(comp => comp.risk);
        expect(mappedRisks.includes(false)).toEqual(true);
    });

    test('Should return a length of 2 with no security exclusions', async () => {
        const vulDataString = JSON.stringify(vulnerabilityData)
        const vulData: IBlackDuckViolations = JSON.parse(vulDataString);
        const mockInputExclusionString = "";
        const mockExclusionArray = mockInputExclusionString.length > 0 ? mockInputExclusionString.split(', ') : [];
        const mockSecRisks: IRiskState[] = await blackduckCheck.checkExclusions(mockExclusionArray, vulData.items, vulData.totalCount, "security");
        expect(mockSecRisks.length).toEqual(2);
        const listComps: IRiskState[] = await blackduckCheck.listComponents(vulData.items, vulData.totalCount, "security");
        expect(listComps.length).toEqual(2);
    });

    test('Should return a length of 2 with no policy exclusions', async () => {
        const polDataString = JSON.stringify(licenseData);
        const polData: IBlackDuckViolations = JSON.parse(polDataString);
        const mockInputExclusionString = "";
        const mockExclusionArray = mockInputExclusionString.length > 0 ? mockInputExclusionString.split(', ') : [];
        const mockPolRisks: IRiskState[] = await blackduckCheck.listComponents(polData.items, polData.totalCount, "policy");
        expect(mockPolRisks.length).toEqual(2);
    });

    test('Should return true with one license exclusions', async () => {
        const licDataString = JSON.stringify(licenseData);
        const licData: IBlackDuckViolations = JSON.parse(licDataString);
        const mockInputExclusionString = "Criipto.Configuration";
        const mockExclusionArray = mockInputExclusionString.length > 0 ? mockInputExclusionString.split(', ') : [];
        const mockLicRisks: IRiskState[] = await blackduckCheck.checkExclusions(mockExclusionArray, licData.items, licData.totalCount, "license");
        const mappedRisks = mockLicRisks.map(comp => comp.risk);
        expect(mappedRisks.includes(false)).toEqual(true);
    });

    test('Should return false with two license exclusions', async () => {
        const licDataString = JSON.stringify(licenseData);
        const polData: IBlackDuckViolations = JSON.parse(licDataString);
        const mockInputExclusionString = "Criipto.Configuration, Pickles.CommandLine.win";
        const mockExclusionArray = mockInputExclusionString.length > 0 ? mockInputExclusionString.split(', ') : [];
        const mockPolRisks: IRiskState[] = await blackduckCheck.checkExclusions(mockExclusionArray, polData.items, polData.totalCount, "license");
        expect(mockPolRisks.some(comp => comp.risk === true)).toEqual(false);
    });
})