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

    async failOnSecurityRisks(bdData: IBlackDuckVersion, exclusionList:string[] ): Promise<IRiskState[]> {
        console.log("Checking for security risks...");
        try {
            let message: string;
            let result: IRiskState[] = [];
            let violationUrl = `${bdData.items[0]._meta.href}/components?filter=securityRisk%3Ahigh&filter=securityRisk%3Acritical`;
            let securityRisks: IBlackDuckViolations = await this.getViolations(violationUrl, this.bearerToken);
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

    async failOnLicenseRisks(bdData: IBlackDuckVersion, exclusionList: string[]): Promise<IRiskState[]> {
        console.log("Checking for license risks...");
        try {
            let message: string;
            let result: IRiskState[] = [];
            let licenseUrl = `${bdData.items[0]._meta.href}/components?filter=licenseRisk%3Ahigh`;
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
    
    async failOnPolicyViolations(versionDetails: IBlackDuckVersion, exclusionList: string[]): Promise<IRiskState[]> {
        console.log("Checking for policy violations...");
        try
        {
            let policyVersionRisk = versionDetails.items[0].policyStatusSummaries; 
            let message: string;
            let result: IRiskState[] = [];
            let policyUrl = `${versionDetails.items[0]._meta.href}/components?filter=bomPolicy%3Ain_violation`;
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