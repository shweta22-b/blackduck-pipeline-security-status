import { IBlackDuckToken } from '../models/IBlackDuckToken';
import { IBlackDuckProject } from '../models/IBlackDuckProject';
import { IBlackDuckVersion } from '../models/IBlackDuckVersion';
import { IBlackDuckViolations } from '../models/IBlackDuckViolations';
import { IRequestOptions } from '../models/IRequestOptions';
import { IRiskState } from '../models/IRiskState';
import { Count, PolicyStatusSummaries } from '../models/ISharedItems';
import * as https from 'https';
import { reject } from 'q';
import { resolve } from 'path/posix';

export class BlackDuckCheck {
    private bdToken: string;
    public bdProjectName: string;
    public bdVersionName: string;
    public baseUrl: string;
    
    constructor(_bdToken:string, _bdProjectName:string, _bdVersionName:string, _baseUrl:string){
        this.bdToken = _bdToken;
        this.bdProjectName = _bdProjectName;
        this.bdVersionName = _bdVersionName;
        this.baseUrl = _baseUrl;
    }

    private async authenticate(_baseUrl, _bdToken: string): Promise<string> {
    console.log("Authenticating...");
    let options: IRequestOptions = {
        hostname: _baseUrl,
        port: 443,
        path: '/api/tokens/authenticate',
        method: 'POST',
        headers: {
            'Authorization': `token ${this.bdToken}`,
            'Accept': 'application/vnd.blackducksoftware.user-4+json'
        }
    }
        let bearerResponse: IBlackDuckToken = await this.request(options);
        return bearerResponse.bearerToken;
    }

        async getProjects(_url: string, _bearerToken: string): Promise<IBlackDuckProject> {
        console.log("Get Projects...");
        let options: IRequestOptions = {
            port: 443,
            headers: {
                'Authorization': `Bearer ${_bearerToken}`,
                'Accept': 'application/vnd.blackducksoftware.project-detail-4+json'
            }
        }
        return await this.getRequest(_url, options);
    }

    async getVersions(_url: string, _bearerToken: string): Promise<IBlackDuckVersion> {
        console.log("Get Versions...");
        let options: IRequestOptions = {
            port: 443,
            headers: {
                'Authorization': `Bearer ${_bearerToken}`,
                'Accept': '*/*'
            }
        }
        return await this.getRequest(_url, options);
    }

    async getViolations(_url: string, _bearerToken: string): Promise<IBlackDuckViolations> {
        console.log("Get Violations...");
        let options: IRequestOptions = {
            port: 443,
            headers: {
                'Authorization': `Bearer ${_bearerToken}`,
                'Accept': 'application/vnd.blackducksoftware.bill-of-materials-6+json'
            }
        }
        return await this.getRequest(_url, options);
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

    async request(options: IRequestOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                if (res.statusCode > 200 && res.statusCode < 300)
                {
                    return reject(new Error(`status code ${res.statusCode}`));
                }
                let body = [];
                let response;
                res.on('data', (data) => {
                    body.push(data);
                });
                res.on('end', () => {
                    try
                    {
                        response = JSON.parse(Buffer.concat(body).toString());
                    }
                    catch (error)
                    {
                        reject(error);
                    }
                    resolve(response);
                })
            });

            req.on('error', (error) => {
                reject(error);
            });
            req.end();
        });
    }

    async getRequest(url: string, options: IRequestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        const req = https.get(url, options, (res) => {
            if (res.statusCode > 200 && res.statusCode < 300)
            {
                return reject(new Error(`status code ${res.statusCode}`));
            }
            let body = [];
            let response;
            res.on('data', (data) => {
                body.push(data);
            });
            res.on('end', () => {
                try
                {
                    response = JSON.parse(Buffer.concat(body).toString());
                }
                catch (error)
                {
                    reject(error);
                }
                resolve(response);
            })
        });

        req.on('error', (error) => {
            reject(error);
        });
            req.end();
        });
    }

    async failOnSecurityRisks(bdData: IBlackDuckVersion): Promise<IRiskState> {
        console.log("Checking for security risks...");
        try {
            let versionSecurityRisk = bdData.items[0].securityRiskProfile.counts;
            let severityCheck: boolean = await this.checkViolations(versionSecurityRisk);
            let message: string;
            if (severityCheck)
            {
                message = "A critical or high secuirty vulnerability detected"
            }
            else
            {
                message = "No critical or high security errors detected"
            }
            console.log(message);
            return {
                risk: severityCheck,
                message: message
            }
        } 
        catch (error) {
            console.log(error);
            reject(error)
        }
    }

    async failOnLicenseRisks(bdData: IBlackDuckVersion): Promise<IRiskState> {
        console.log("Checking for license risks...")
        try {
            let versionLicenseRisk = bdData.items[0].licenseRiskProfile.counts;
            let licenseCheck: boolean = await this.checkViolations(versionLicenseRisk);
            let message: string;
            if (licenseCheck) {
                message = "A critical or high license risk detected"
            }
            else {
                message = "No critical or high license risk detected"
            }
            console.log(message);
            return {
                risk: licenseCheck,
                message: message
            }
            
        } catch (error) {
            reject(error);
        }
    }
    
    async failOnPolicyViolations(versionDetails: IBlackDuckVersion): Promise<IRiskState> {
        try
        {
            let policyVersionRisk = versionDetails.items[0].policyStatusSummaries;
            let poilicyCheck: boolean = await this.checkPolicy(policyVersionRisk);
            let message: string;
            if (poilicyCheck) {
                message = "A policy violation is detected";
            }
            else {
                message = "No policy violsations were detected";
            }
            console.log(message);
            return {
                risk: poilicyCheck,
                message: message
            }

        }
        catch (error)
        {
            console.log(error)
        }
    }

    async run(): Promise<IBlackDuckVersion> {
        let bearerToken = await this.authenticate(this.baseUrl, this.bdToken);
        let projectUrl = `https://${this.baseUrl}/api/projects?q=name:${this.bdProjectName}`;
        const projectDetails = await this.getProjects(projectUrl, bearerToken);
        const versionUrl = `${projectDetails.items[0]._meta.href}/versions?q=versionName:${this.bdVersionName}`;
        let versionDetails: IBlackDuckVersion = await this.getVersions(versionUrl, bearerToken);
        return versionDetails
    }
}