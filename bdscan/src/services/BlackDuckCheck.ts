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

    async checkViolations(violationProfiles: Count[] | undefined): Promise<boolean> {
        let value = false;
        if (violationProfiles === undefined)
        {
            return true
        }
        violationProfiles.forEach(item => {
            if (item.countType.toUpperCase() == 'CRITICAL' || item.countType.toUpperCase() == 'HIGH')
            {
                if (item.count > 0)
                {
                    value = true;
                }
            }
        });
        if (value)
        {
            return true
        }
        else
        {
            return false
        }
    }

    async checkPolicy(policyProfile: PolicyStatusSummaries[]): Promise<boolean> {
        let value = false;
        if (policyProfile === undefined)
        {
            return true
        }
        policyProfile.forEach(item => {
            if (item.status.toUpperCase() == 'IN_VIOLATION')
            {
                value = true;
            }
        });
        if (value)
        {
            return true
        }
        else
        {
            return false
        }
    }

    async failOnSecurityRisks(bdData: IBlackDuckVersion, exclusionList:string[] ): Promise<IRiskState[]> {
        console.log("Checking for security risks...");
        try {
            let versionSecurityRisk = bdData.items[0].securityRiskProfile.counts;
            let severityCheck: boolean = await this.checkViolations(versionSecurityRisk);
            let message: string;
            let result: IRiskState[] = [];
            if (severityCheck && exclusionList.length > 0)
            {
                const violationUrl = `${bdData.items[0]._meta.href}/vulnerable-bom-components`;
                const securityRisks:IBlackDuckViolations = await this.getViolations(violationUrl, this.bearerToken);
                result = await this.checkExclusions(exclusionList, securityRisks.items, "security");
            }
            else if (severityCheck) {
                message = "Critical or high security risks detected"
                console.log(message);
                const violationUrl = `${bdData.items[0]._meta.href}/vulnerable-bom-components`;
                const securityRisks: IBlackDuckViolations = await this.getViolations(violationUrl, this.bearerToken);
                result = await this.listComponents(securityRisks.items, "security");
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
            let versionLicenseRisk = bdData.items[0].licenseRiskProfile.counts;
            let licenseCheck: boolean = await this.checkViolations(versionLicenseRisk);
            let message: string;
            let result: IRiskState[] = [];
            if (licenseCheck && exclusionList.length > 0) {
                message = "A critical or high license risk was detected"
                const licenseUrl = `${bdData.items[0]._meta.href}/components?filter=licenseRisk%3Ahigh`;
                const licenseRisks: IBlackDuckViolations = await this.getViolations(licenseUrl, this.bearerToken);
                result = await this.checkExclusions(exclusionList, licenseRisks.items, "license");
            }
            else if (licenseCheck) {
                message = "A critical or high license risk was detected"
                const licenseUrl = `${bdData.items[0]._meta.href}/components?filter=licenseRisk%3Ahigh`;
                const licenseRisks: IBlackDuckViolations = await this.getViolations(licenseUrl, this.bearerToken);
                result = await this.listComponents(licenseRisks.items, "license");
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
            let poilicyCheck: boolean = await this.checkPolicy(policyVersionRisk);
            let message: string;
            let result: IRiskState[] = [];
            if (poilicyCheck && exclusionList.length > 0) {
                const policyUrl = `${versionDetails.items[0]._meta.href}/components?filter=bomPolicy%3Ain_violation`;
                const policyRisks: IBlackDuckViolations = await this.getViolations(policyUrl, this.bearerToken);
                result = await this.checkExclusions(exclusionList, policyRisks.items, "policy")
            }
            else if (poilicyCheck) {
                message = "A policy violation was detected";
                const policyUrl = `${versionDetails.items[0]._meta.href}/components?filter=bomPolicy%3Ain_violation`;
                const policyRisks: IBlackDuckViolations = await this.getViolations(policyUrl, this.bearerToken);
                result = await this.listComponents(policyRisks.items, "policy")
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

    async checkExclusions(exclusionList: string[], risks: ViolationsItem[], label: string): Promise<IRiskState[]> {
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
        return result;
    }

    async listComponents(risks: ViolationsItem[], label): Promise<IRiskState[]> {
        let message: string;
        let result: IRiskState[] = [];
        for (const component of risks)
        {
            let riskAssessment: IRiskState;
            message = `${component.componentName} is ${label} a risk.`
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