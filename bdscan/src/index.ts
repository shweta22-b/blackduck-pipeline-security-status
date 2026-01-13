import * as core from '@actions/core';
import { IRiskState } from './models/IRiskState';
import { IBlackDuckVersion } from './models/IBlackDuckVersion';
import { BlackDuckCheck } from './services/BlackDuckCheck';

async function run() {
    try {
        // Get inputs from action.yml
        const bdUrl = core.getInput('blackduck-url', { required: false }) || 'allegion.blackducksoftware.com';
        const bdToken = core.getInput('blackduck-token', { required: true });
        const bdProjectName = core.getInput('project-name', { required: true });
        const bdVersionName = core.getInput('version-name', { required: true });
        
        // Mask the token in logs
        core.setSecret(bdToken);
        
        console.log(`Checking Black Duck project: ${bdProjectName}`);
        console.log(`Version: ${bdVersionName}`);
        
        // Initialize Black Duck check
        const blackduckCheck = new BlackDuckCheck(bdToken, bdProjectName, bdVersionName, bdUrl);
        
        /* Run BlackDuck API Calls */
        let blackDuckData: IBlackDuckVersion = await blackduckCheck.callBlackDuckAPI();
        
        console.log(`Found version data: ${JSON.stringify(blackDuckData, null, 2)}`);
        
        let hasFailures = false;
        
        /* Check licenses */
        const failOnLicenseSelection = core.getBooleanInput('fail-on-license-risks', { required: false });
        const licenseExclusionsList = core.getInput('license-exclusions', { required: false });
        let licenseList = licenseExclusionsList === '' ? [] : licenseExclusionsList.split(', ');
        if (failOnLicenseSelection){
            const licenseCheck = await blackduckCheck.failOnLicenseRisks(blackDuckData, licenseList);
            licenseCheck.forEach((riskAssessment) => {
                if (riskAssessment.risk)
                {
                    core.error(riskAssessment.message);
                    hasFailures = true;
                }
                else {
                    core.info(riskAssessment.message);
                }
            });
        }

        /* Security check*/
        const failOnSecuritySelection = core.getBooleanInput('fail-on-security-risks', { required: false });
        const securityExclusionList = core.getInput('security-exclusions', { required: false });
        let securityList = securityExclusionList === '' ? [] : securityExclusionList.split(', ');
        if (failOnSecuritySelection){
            let securityCheck: IRiskState[] = await blackduckCheck.failOnSecurityRisks(blackDuckData, securityList);
            securityCheck.forEach((riskAssessment) => {
                if (riskAssessment.risk){
                    core.error(riskAssessment.message);
                    hasFailures = true;
                }
                else{
                    core.info(riskAssessment.message);
                }
            });
        }

        /* Policy check */
        const failOnPolicySelection = core.getBooleanInput('fail-on-policy-violations', { required: false });
        const policyExclusionList = core.getInput('policy-exclusions', { required: false });
        const policySeveritiesInput = core.getInput('policy-severities', { required: false });
        let policyList = policyExclusionList === '' ? [] : policyExclusionList.split(', ');
        let policySeverities = policySeveritiesInput === '' ? [] : policySeveritiesInput.split(',').map(s => s.trim());
        if (failOnPolicySelection){
            let policyCheck:IRiskState[] = await blackduckCheck.failOnPolicyViolations(blackDuckData, policyList, policySeverities);
            policyCheck.forEach((riskAssessment) => {
                if (riskAssessment.risk)
                {
                    core.error(riskAssessment.message);
                    hasFailures = true;
                }
                else
                {
                    core.info(riskAssessment.message);
                }
            })
        }
        
        if (hasFailures) {
            core.setFailed("Black Duck scan found security risks, license risks, or policy violations.");
        } else {
            core.info("Black Duck scan complete. No checks failed.");
        }
    }
    catch (err) {
        core.setFailed(err.message);
    }
}

run();