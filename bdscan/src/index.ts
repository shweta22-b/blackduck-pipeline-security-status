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
        const bdService = task.getInput('blackduckconnection', false);
        const bdTkn = task.getInput('blackducktoken', false);
        const bdProjectName = task.getInput('projectName', true);
        const bdVersionName = task.getInput('versionName', true);
        const baseUrl = "allegion.blackducksoftware.com";
        let blackduckCheck: BlackDuckCheck;
        
        if (bdService === undefined && bdTkn === undefined){
            task.setResult(task.TaskResult.Failed, 'Need Black Duck connection string or token');
            return
        }

        /* Get Black Duck Token from Service Connection*/
        else if(bdTkn === undefined && typeof bdService !== undefined) {
            let bdCreds: IBlackDuckConfig = await getBlackDuckCredentials(bdService);
            task.setSecret(bdCreds.blackduckApiToken);
            blackduckCheck = new BlackDuckCheck(bdCreds.blackduckApiToken, bdProjectName, bdVersionName, baseUrl);
        }
        
        else if (bdService === undefined && typeof bdTkn !== undefined) {
            task.setSecret(bdTkn);
            blackduckCheck = new BlackDuckCheck(bdTkn, bdProjectName, bdVersionName, baseUrl);
        }
        /* Run BlackDuck API Calls */
        let blackDuckData: IBlackDuckVersion = await blackduckCheck.callBlackDuckAPI();
        
        /* Check licenses */
        const failOnLicenseSelection = task.getBoolInput('failOnLicenseRisks', false);
        const licenseExclusionsList = task.getInput('licenseExclusions', false);
        let licenseList = licenseExclusionsList === undefined ? [] : licenseExclusionsList.split(', ');
        if (failOnLicenseSelection){
            const licenseCheck = await blackduckCheck.failOnLicenseRisks(blackDuckData, licenseList);
            licenseCheck.forEach((riskAssessment) => {
                if (riskAssessment.risk)
                {
                    task.setResult(task.TaskResult.Failed, riskAssessment.message, true);
                }
                else {
                    task.setResult(task.TaskResult.Succeeded, riskAssessment.message)
                }
            });
        }

        /* Security check*/
        const failOnSecuritySelection = task.getBoolInput('failOnSecurityRisks', false);
        const securityExclusionList = task.getInput('securityExclusions', false);
        let securityList = securityExclusionList === undefined ? [] : securityExclusionList.split(', ');
        if (failOnSecuritySelection){
            let securityCheck: IRiskState[] = await blackduckCheck.failOnSecurityRisks(blackDuckData, securityList);
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
        const policyExclusionList = task.getInput('policyExclusions', false);
        let policyList = policyExclusionList === undefined ? [] : policyExclusionList.split(', ');
        if (failOnPolicySelection){
            let policyCheck:IRiskState[] = await blackduckCheck.failOnPolicyViolations(blackDuckData, policyList);
            policyCheck.forEach((riskAssessment) => {
                if (riskAssessment.risk)
                {
                    task.setResult(task.TaskResult.Failed, riskAssessment.message);
                }
                else
                {
                    task.setResult(task.TaskResult.Succeeded, riskAssessment.message)
                }
            })
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