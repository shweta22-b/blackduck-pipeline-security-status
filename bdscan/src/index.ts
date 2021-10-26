import * as task from 'azure-pipelines-task-lib/task';
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
        if (bdService == undefined){
            task.setResult(task.TaskResult.Failed, 'Need Black Duck connection string');
            return
        }
        let bdCreds: IBlackDuckConfig = await blackduckCheck.getBlackDuckCredentials(bdService);
        let bearerResponse: IBlackDuckToken = await blackduckCheck.authenticate(baseUrl, bdCreds);
        let projectUrl = `https://${baseUrl}/api/projects?q=name:${bdProjectName}`;
        let projectDetails: IBlackDuckProject = await blackduckCheck.getProjects(projectUrl, bearerResponse);
        let versionUrl = `${projectDetails.items[0]._meta.href}/versions?q=versionName:${bdVersionName}`;
        let versionDetails: IBlackDuckVersion = await blackduckCheck.getVersions(versionUrl, bearerResponse);
        let versionSecurityRisk = versionDetails.items[0].securityRiskProfile.counts;
        let severityCheck: boolean = await blackduckCheck.checkVersionSecurityRisks(versionSecurityRisk);
        if (severityCheck){

            /** TODO: Add ability to filter out data **/
            
            // let bomUrl = `${versionDetails.items[0]._meta.href}/vulnerable-bom-components`;
            // let violationDetails: IBlackDuckViolations = await getViolations(bomUrl, bearerResponse);
            console.log("A critical or high vulnerability detected");
            task.setResult(task.TaskResult.Failed, "A critical or high vulnerability detected", true);
        }
        else {
            console.log("No critical or high security errors detected");
            task.setResult(task.TaskResult.Succeeded, "No critical or high security errors detected", true);
        }
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();