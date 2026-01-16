/**
 * Black Duck Security Scan - GitHub Action Entry Point
 * 
 * This action scans Black Duck projects for:
 * - Security vulnerabilities (CRITICAL/HIGH)
 * - License risks (CRITICAL/HIGH)
 * - Policy violations (configurable severities)
 * 
 * @author ProductTech
 */

import * as core from '@actions/core';
import { IRiskState } from './models/IRiskState';
import { IBlackDuckVersion } from './models/IBlackDuckVersion';
import { BlackDuckCheck } from './services/BlackDuckCheck';

/**
 * Main execution function for the GitHub Action
 * Orchestrates the Black Duck security scanning process
 */
async function run() {
    try {
        // ========================================
        // Step 1: Get and validate inputs
        // ========================================
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
        
        // ========================================
        // Step 3: Check License Risks
        // ========================================
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

        // ========================================
        // Step 4: Check Security Vulnerabilities
        // ========================================
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

        // ========================================
        // Step 5: Check Policy Violations
        // ========================================
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
        
        // ========================================
        // Step 6: Report Final Results
        // ========================================
        if (hasFailures) {
            core.setFailed("Black Duck scan found security risks, license risks, or policy violations.");
        } else {
            core.info("✅ Black Duck scan complete. No checks failed.");
        }
    }
    catch (err) {
        // Handle and report any errors that occurred during execution
        const errorMessage = err instanceof Error ? err.message : String(err);
        core.setFailed(errorMessage);
    }
}

// Execute the action
run();