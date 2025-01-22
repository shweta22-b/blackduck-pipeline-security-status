import { BlackDuckCheck } from "./BlackDuckCheck";
import { IBlackDuckVersion } from "../models/IBlackDuckVersion";
import { IRequestOptions } from "../models/IRequestOptions";
import { IBlackDuckProject } from "../models/IBlackDuckProject";
import { IBlackDuckViolations } from "../models/IBlackDuckViolations";
import { IBlackDuckToken } from "../models/IBlackDuckToken";
import * as https from 'https';

export class BlackDuckAPICalls {
    private bdToken: string;
    public bearerToken: string;
    public bdProjectName: string;
    public bdVersionName: string;
    public baseUrl: string;

    constructor(_bdToken: string, _bdProjectName: string, _bdVersionName: string, _baseUrl: string) {
        this.bdToken = _bdToken;
        this.bdProjectName = _bdProjectName;
        this.bdVersionName = _bdVersionName;
        this.baseUrl = _baseUrl.replace(/^https:\/\//, "").replace(/\/$/, '');
    }

    async authenticate(_baseUrl, _bdToken: string): Promise<string> {
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
                'Accept': 'application/vnd.blackducksoftware.project-detail-5+json'
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

    async callBlackDuckAPI(): Promise<IBlackDuckVersion> {
        this.bearerToken = await this.authenticate(this.baseUrl, this.bdToken);
        let projectUrl = `https://${this.baseUrl}/api/projects?q=name:${this.bdProjectName}`;
        const projectDetails = await this.getProjects(projectUrl, this.bearerToken);
        const versionUrl = `${projectDetails.items[0]._meta.href}/versions?q=versionName:${this.bdVersionName}`;
        let versionDetails: IBlackDuckVersion = await this.getVersions(versionUrl, this.bearerToken);
        return versionDetails
    }
}