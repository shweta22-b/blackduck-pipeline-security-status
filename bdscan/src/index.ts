import * as task from 'azure-pipelines-task-lib/task';
import { DetectADOConstants } from './lib/BlackDuckConstants';
import {IBlackDuckConfig} from './models/IBlackDuckConfig';
import { IBlackDuckToken } from './models/IBlackDuckToken';
import { IBlackDuckProject } from './models/IBlackDuckProject';
import { IRiskState } from './models/IRiskState';
import { IBlackDuckVersion } from './models/IBlackDuckVersion';
import { BlackDuckCheck } from './services/BlackDuckCheck';
import { BlackDuckAPICalls } from './services/BlackDuckAPICalls'

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
        
        /* Run BlackDuck API Calls */
        let blackduckCheck = new BlackDuckCheck(bdCreds.blackduckApiToken, bdProjectName, bdVersionName, baseUrl);
        let blackDuckData: IBlackDuckVersion = await blackduckCheck.callBlackDuckAPI();
        
        /* Check licenses */
        const failOnLicenseSelection = task.getBoolInput('failOnLicenseRisks', false);
        if (failOnLicenseSelection){
            const licenseCheck = await blackduckCheck.failOnLicenseRisks(blackDuckData);
            if (licenseCheck.risk){
                task.setResult(task.TaskResult.Failed, licenseCheck.message, true);
            }
        }

        /* Security check*/
        const failOnSecuritySelection = task.getBoolInput('failOnSecurityRisks', false);
        const securityExclusionList = task.getInput('securityExclusions', false);
        let exclusionList = securityExclusionList.length > 0 ? securityExclusionList.split(', ') : [];
        if (failOnSecuritySelection){
            let securityCheck: IRiskState[] = await blackduckCheck.failOnSecurityRisks(blackDuckData, exclusionList);
            securityCheck.forEach((riskAssessment) => {
                if (riskAssessment.risk){
                    task.setResult(task.TaskResult.Failed, riskAssessment.message);
                }
                else{
                    task.setResult(task.TaskResult.Succeeded, riskAssessment.message)
                }
            });
        }

        /* Policy check */
        const failOnPolicySelection = task.getBoolInput('failOnPolicyViolations', false);
        if (failOnPolicySelection){
            let policyCheck:IRiskState = await blackduckCheck.failOnPolicyViolations(blackDuckData);
            if (policyCheck.risk) {
                task.setResult(task.TaskResult.Failed, policyCheck.message);
            }
        }
        task.setResult(task.TaskResult.Succeeded, "Black Duck scan complete. No checks failed.")
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



