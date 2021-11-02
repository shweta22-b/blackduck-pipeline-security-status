import { IBlackDuckConfig } from '../models/IBlackDuckConfig';
import { IBlackDuckToken } from '../models/IBlackDuckToken';
import { IBlackDuckProject } from '../models/IBlackDuckProject';
import { IBlackDuckVersion } from '../models/IBlackDuckVersion';
import { IBlackDuckViolations } from '../models/IBlackDuckViolations';
import { IRequestOptions } from '../models/IRequestOptions';
import { Count, PolicyStatusSummaries } from '../models/ISharedItems';
import * as https from 'https';

class BlackDuckCheck {
    constructor(){}

    async authenticate(_baseUrl, _bdToken: string): Promise<IBlackDuckToken> {
    console.log("Authenticating...");
    let options: IRequestOptions = {
        hostname: _baseUrl,
        port: 443,
        path: '/api/tokens/authenticate',
        method: 'POST',
        headers: {
            'Authorization': `token ${_bdToken}`,
            'Accept': 'application/vnd.blackducksoftware.user-4+json'
        }
    }
        return await this.request(options);
    }

        async getProjects(_url: string, _bearerResponse: IBlackDuckToken): Promise<IBlackDuckProject> {
        console.log("Get Projects...");
        let options: IRequestOptions = {
            port: 443,
            headers: {
                'Authorization': `Bearer ${_bearerResponse.bearerToken}`,
                'Accept': 'application/vnd.blackducksoftware.project-detail-4+json'
            }
        }
        return await this.getRequest(_url, options);
    }

    async getVersions(_url: string, _bearerResponse: IBlackDuckToken): Promise<IBlackDuckVersion> {
        console.log("Get Versions...");
        let options: IRequestOptions = {
            port: 443,
            headers: {
                'Authorization': `Bearer ${_bearerResponse.bearerToken}`,
                'Accept': '*/*'
            }
        }
        return await this.getRequest(_url, options);
    }

    async getViolations(_url: string, _bearerResponse: IBlackDuckToken): Promise<IBlackDuckViolations> {
        console.log("Get Violations...");
        let options: IRequestOptions = {
            port: 443,
            headers: {
                'Authorization': `Bearer ${_bearerResponse.bearerToken}`,
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

}

export const blackduckCheck = new BlackDuckCheck();