/**
 * BlackDuckCheck - Service for Black Duck security analysis
 * 
 * Performs security checks on Black Duck projects including:
 * - Security vulnerability scanning (CRITICAL/HIGH)
 * - License risk assessment (CRITICAL/HIGH)
 * - Policy violation detection
 * 
 * Supports exclusion lists for components, licenses, and policies
 */

import { IBlackDuckToken } from '../models/IBlackDuckToken';
import { IBlackDuckProject } from '../models/IBlackDuckProject';
import { IBlackDuckVersion } from '../models/IBlackDuckVersion';
import { IBlackDuckViolations } from '../models/IBlackDuckViolations';
import { IRiskState } from '../models/IRiskState';
import { Count, PolicyStatusSummaries, ViolationsItem } from '../models/ISharedItems';
import { BlackDuckAPICalls } from './BlackDuckAPICalls';

export class BlackDuckCheck extends BlackDuckAPICalls {
    
    constructor(_bdToken: string, _bdProjectName: string, _bdVersionName: string, _baseUrl: string) {
        super(_bdToken, _bdProjectName, _bdVersionName, _baseUrl);
    }

    /**
     * Check for CRITICAL and HIGH security vulnerabilities
     * @param bdData - Black Duck version data containing component information
     * @param exclusionList - List of component names to exclude from security checks
     * @returns Array of risk assessment results
     */
    async failOnSecurityRisks(bdData: IBlackDuckVersion, exclusionList:string[] ): Promise<IRiskState[]> {
        console.log("Checking for security risks...");
        try {
            if (!bdData || !bdData.items || bdData.items.length === 0) {
                throw new Error(`Version data not found or empty`);
            }
            
            let message: string;
            let result: IRiskState[] = [];
            let violationUrl = `${bdData.items[0]._meta.href}/components?filter=securityRisk%3Ahigh&filter=securityRisk%3Acritical`;
            console.log(`Querying security risks at: ${violationUrl}`);
            let securityRisks: IBlackDuckViolations = await this.getViolations(violationUrl, this.bearerToken);
            console.log(`Security risks found: ${securityRisks.totalCount}`);
            let severityCheck: boolean = securityRisks.totalCount > 0 ? true : false
            if (severityCheck && exclusionList.length > 0)
            {
                result = await this.checkExclusions(exclusionList, securityRisks.items, securityRisks.totalCount, "security");
            }
            else if (severityCheck) {
                message = "Critical or high security risks detected"
                console.log(message);
                result = await this.listComponents(securityRisks.items, securityRisks.totalCount, "security");
            }
            else
            {
                message = "No critical or high security risks detected"
                const riskAssessment = {
                    risk: severityCheck,
                    message: message
                }
                result.push(riskAssessment);
            }
            return result
        } 
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Check for CRITICAL and HIGH license risks
     * @param bdData - Black Duck version data containing component information
     * @param exclusionList - List of license names to exclude from license checks
     * @returns Array of risk assessment results
     */
    async failOnLicenseRisks(bdData: IBlackDuckVersion, exclusionList: string[]): Promise<IRiskState[]> {
        console.log("Checking for license risks...");
        try {
            if (!bdData || !bdData.items || bdData.items.length === 0) {
                throw new Error(`Version data not found or empty`);
            }
            
            let message: string;
            let result: IRiskState[] = [];
            let licenseUrl = `${bdData.items[0]._meta.href}/components?filter=licenseRisk%3Ahigh&filter=licenseRisk%3Acritical`;
            let licenseRisks: IBlackDuckViolations = await this.getViolations(licenseUrl, this.bearerToken);
            let licenseCheck: boolean = licenseRisks.totalCount > 0 ? true : false;
            if (licenseCheck && exclusionList.length > 0) {
                message = "A critical or high license risk was detected"
                result = await this.checkExclusions(exclusionList, licenseRisks.items, licenseRisks.totalCount, "license");
            }
            else if (licenseCheck) {
                message = "A critical or high license risk was detected"
                result = await this.listComponents(licenseRisks.items, licenseRisks.totalCount, "license");
            }
            else {
                message = "No critical or high license risks were detected"
                const riskAssessment = {
                    risk: licenseCheck,
                    message: message
                }
                console.log(message);
                result.push(riskAssessment);
            }
            return result; 
            
        } catch (error) {
            console.log(error);
        }
    }
    
    /**
     * Check for policy violations with configurable severity filtering
     * @param versionDetails - Black Duck version details
     * @param exclusionList - List of policy names to exclude from checks
     * @param policySeverities - List of policy severities to check (e.g., BLOCKER, CRITICAL)
     * @returns Array of risk assessment results
     */
    async failOnPolicyViolations(versionDetails: IBlackDuckVersion, exclusionList: string[], policySeverities: string[]): Promise<IRiskState[]> {
        console.log("Checking for policy violations...");
        try
        {
            if (!versionDetails || !versionDetails.items || versionDetails.items.length === 0) {
                throw new Error(`Version details not found or empty`);
            }
            
            let policyVersionRisk = versionDetails.items[0].policyStatusSummaries; 
            let message: string;
            let result: IRiskState[] = [];
            let policyUrl = `${versionDetails.items[0]._meta.href}/components?filter=bomPolicy%3Ain_violation`;
            
            // Add severity filters if specified
            if (policySeverities && policySeverities.length > 0) {
                const severityFilters = policySeverities.map(s => `filter=policySeverity%3A${s.toLowerCase()}`).join('&');
                policyUrl += `&${severityFilters}`;
                console.log(`Filtering policy violations by severities: ${policySeverities.join(', ')}`);
            }
            
            console.log(`Querying policy violations at: ${policyUrl}`);
            let policyRisks: IBlackDuckViolations = await this.getViolations(policyUrl, this.bearerToken);
            let poilicyCheck: boolean = policyRisks.totalCount > 0 ? true : false;
            if (poilicyCheck && exclusionList.length > 0) {
                result = await this.checkExclusions(exclusionList, policyRisks.items, policyRisks.totalCount, "policy")
            }
            else if (poilicyCheck) {
                message = "A policy violation was detected";
                result = await this.listComponents(policyRisks.items, policyRisks.totalCount, "policy")
            }
            else {
                message = "No policy violations were detected";
                const riskAssessment = {
                    risk: poilicyCheck,
                    message: message
                }
                console.log(message);
                result.push(riskAssessment);
            }
            
            return result

        }
        catch (error)
        {
            console.log(error);
        }
    }

    async checkExclusions(exclusionList: string[], risks: ViolationsItem[], violationCount: number, label: string): Promise<IRiskState[]> {
        let message: string;
        let result: IRiskState[] = [];
        for (const component of risks)
        {
            let riskAssessment: IRiskState;
            if (exclusionList.includes(component.componentName))
            {
                message = `EXCLUDED: ${component.componentName} from ${label} risk assessment.`;
                console.log(message);
                riskAssessment = {
                    risk: false,
                    message: message
                }
                result.push(riskAssessment);
            }
            else
            {
                message = `${component.componentName} is a ${label} risk.`
                console.log(message);
                riskAssessment = {
                    risk: true,
                    message: message
                }
                result.push(riskAssessment);
            }
        }
        if (violationCount > 10)
        {
            let riskAssessment: IRiskState;
            message = `More than ${violationCount} ${label} risks were found.`
            console.log(message);
            riskAssessment = {
                risk: true,
                message: message
            }
            result.push(riskAssessment);
        }
        return result;
    }

    async listComponents(risks: ViolationsItem[], violationCount: number, label): Promise<IRiskState[]> {
        let message: string;
        let result: IRiskState[] = [];
        for (const component of risks)
        {
            let riskAssessment: IRiskState;
            message = `${component.componentName} is a ${label} risk.`
            console.log(message);
            riskAssessment = {
                risk: true,
                message: message
            }
            result.push(riskAssessment);
        }
        if (violationCount > 10) {
            let riskAssessment: IRiskState;
            message = `More than ${violationCount} ${label} risks were found.`
            console.log(message);
            riskAssessment = {
                risk: true,
                message: message
            }
            result.push(riskAssessment);
        }
        return result;
    }
}