import * as task from 'azure-pipelines-task-lib/task';
import { DetectADOConstants } from './lib/BlackDuckConstants';
import {IBlackDuckConfig} from './models/IBlackDuckConfig';
import { IBlackDuckToken } from './models/IBlackDuckToken';
import { IBlackDuckProject } from './models/IBlackDuckProject';
import { IBlackDuckVersion } from './models/IBlackDuckVersion';
import { blackduckCheck } from './services/BlackDuckCheck';

async function run() {
    try {
        const bdService = task.getInput('blackduckconnection', true);
        const bdProjectName = task.getInput('projectName', true);
        const bdVersionName = task.getInput('versionName', true);
        const baseUrl = "allegion.blackducksoftware.com"
        if (bdService === undefined){
            task.setResult(task.TaskResult.Failed, 'Need Black Duck connection string');
            return
        }
        /* Get Black Duck Token */
        let bdCreds: IBlackDuckConfig = await getBlackDuckCredentials(bdService);
        task.setSecret(bdCreds.blackduckApiToken);
        
        /* Get Bearer Token */
        let bearerResponse: IBlackDuckToken = await blackduckCheck.authenticate(baseUrl, bdCreds.blackduckApiToken);
        task.setSecret(bearerResponse.bearerToken);
        
        /* Get specific project  */
        let projectUrl = `https://${baseUrl}/api/projects?q=name:${bdProjectName}`;
        let projectDetails: IBlackDuckProject = await blackduckCheck.getProjects(projectUrl, bearerResponse);
        
        /* Get specific version */
        let versionUrl = `${projectDetails.items[0]._meta.href}/versions?q=versionName:${bdVersionName}`;
        let versionDetails: IBlackDuckVersion = await blackduckCheck.getVersions(versionUrl, bearerResponse);
        
        /* Check licenses */
        let versionLicenseRisk = versionDetails.items[0].licenseRiskProfile.counts;
        let licenseCheck: boolean = await blackduckCheck.checkViolations(versionLicenseRisk);
        if (licenseCheck)
        {
            console.log("A critical or high license risk detected");
            task.setResult(task.TaskResult.Failed, "A critical or high license risk detected", true);
        }
        else
        {
            console.log("No critical or high license risk detected");
            task.setResult(task.TaskResult.Succeeded, "No critical or high license risk detected", true);
        }

        /* Version Check */
        let versionSecurityRisk = versionDetails.items[0].securityRiskProfile.counts;
        let severityCheck: boolean = await blackduckCheck.checkViolations(versionSecurityRisk);
        if (severityCheck){
            console.log("A critical or high vulnerability detected");
            task.setResult(task.TaskResult.Failed, "A critical or high vulnerability detected", true);
        }
        else {
            console.log("No critical or high security errors detected");
            task.setResult(task.TaskResult.Succeeded, "No critical or high security errors detected", true);
        }

        /* Policy check */
        let policyVersionRisk = versionDetails.items[0].policyStatusSummaries;
        let poilicyCheck: boolean = await blackduckCheck.checkPolicy(policyVersionRisk);
        if (poilicyCheck)
        {
            console.log("A policy shows as Failure");
            task.setResult(task.TaskResult.Failed, "A critical or high vulnerability detected", true);
        }
        else
        {
            console.log("No critical or high security errors detected");
            task.setResult(task.TaskResult.Succeeded, "No critical or high security errors detected", true);
        }
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();

async function getBlackDuckCredentials(bdService): Promise < IBlackDuckConfig > {
    const bdUrl: string = task.getEndpointUrl(bdService, false);
    const bdToken: string = task.getEndpointAuthorizationParameter(bdService, DetectADOConstants.BLACKDUCK_API_TOKEN, false);

    return {
        blackduckUrl: bdUrl,
        blackduckApiToken: bdToken
    }
}