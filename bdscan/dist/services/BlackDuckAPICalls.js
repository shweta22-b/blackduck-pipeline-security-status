"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackDuckAPICalls = void 0;
var https = __importStar(require("https"));
var BlackDuckAPICalls = (function () {
    function BlackDuckAPICalls(_bdToken, _bdProjectName, _bdVersionName, _baseUrl) {
        this.bdToken = _bdToken;
        this.bdProjectName = _bdProjectName;
        this.bdVersionName = _bdVersionName;
        this.baseUrl = _baseUrl.replace(/^https:\/\//, "").replace(/\/$/, '');
    }
    BlackDuckAPICalls.prototype.authenticate = function (_baseUrl, _bdToken) {
        return __awaiter(this, void 0, void 0, function () {
            var options, bearerResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Authenticating...");
                        options = {
                            hostname: _baseUrl,
                            port: 443,
                            path: '/api/tokens/authenticate',
                            method: 'POST',
                            headers: {
                                'Authorization': "token ".concat(this.bdToken),
                                'Accept': 'application/vnd.blackducksoftware.user-4+json'
                            }
                        };
                        return [4, this.request(options)];
                    case 1:
                        bearerResponse = _a.sent();
                        return [2, bearerResponse.bearerToken];
                }
            });
        });
    };
    BlackDuckAPICalls.prototype.getProjects = function (_url, _bearerToken) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Get Projects...");
                        options = {
                            port: 443,
                            headers: {
                                'Authorization': "Bearer ".concat(_bearerToken),
                                'Accept': 'application/vnd.blackducksoftware.project-detail-4+json'
                            }
                        };
                        return [4, this.getRequest(_url, options)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BlackDuckAPICalls.prototype.getVersions = function (_url, _bearerToken) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Get Versions...");
                        options = {
                            port: 443,
                            headers: {
                                'Authorization': "Bearer ".concat(_bearerToken),
                                'Accept': 'application/vnd.blackducksoftware.project-detail-5+json'
                            }
                        };
                        return [4, this.getRequest(_url, options)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BlackDuckAPICalls.prototype.getViolations = function (_url, _bearerToken) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Get Violations...");
                        options = {
                            port: 443,
                            headers: {
                                'Authorization': "Bearer ".concat(_bearerToken),
                                'Accept': 'application/vnd.blackducksoftware.bill-of-materials-6+json'
                            }
                        };
                        return [4, this.getRequest(_url, options)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BlackDuckAPICalls.prototype.request = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        var req = https.request(options, function (res) {
                            if (res.statusCode > 200 && res.statusCode < 300) {
                                return reject(new Error("status code ".concat(res.statusCode)));
                            }
                            var body = [];
                            var response;
                            res.on('data', function (data) {
                                body.push(data);
                            });
                            res.on('end', function () {
                                try {
                                    response = JSON.parse(Buffer.concat(body).toString());
                                }
                                catch (error) {
                                    reject(error);
                                }
                                resolve(response);
                            });
                        });
                        req.on('error', function (error) {
                            reject(error);
                        });
                        req.end();
                    })];
            });
        });
    };
    BlackDuckAPICalls.prototype.getRequest = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        var req = https.get(url, options, function (res) {
                            if (res.statusCode > 200 && res.statusCode < 300) {
                                return reject(new Error("status code ".concat(res.statusCode)));
                            }
                            var body = [];
                            var response;
                            res.on('data', function (data) {
                                body.push(data);
                            });
                            res.on('end', function () {
                                try {
                                    response = JSON.parse(Buffer.concat(body).toString());
                                }
                                catch (error) {
                                    reject(error);
                                }
                                resolve(response);
                            });
                        });
                        req.on('error', function (error) {
                            reject(error);
                        });
                        req.end();
                    })];
            });
        });
    };
    BlackDuckAPICalls.prototype.callBlackDuckAPI = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, projectUrl, projectDetails, versionUrl, versionDetails;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, this.authenticate(this.baseUrl, this.bdToken)];
                    case 1:
                        _a.bearerToken = _b.sent();
                        projectUrl = "https://".concat(this.baseUrl, "/api/projects?q=name:").concat(this.bdProjectName);
                        return [4, this.getProjects(projectUrl, this.bearerToken)];
                    case 2:
                        projectDetails = _b.sent();
                        versionUrl = "".concat(projectDetails.items[0]._meta.href, "/versions?q=versionName:").concat(this.bdVersionName);
                        return [4, this.getVersions(versionUrl, this.bearerToken)];
                    case 3:
                        versionDetails = _b.sent();
                        return [2, versionDetails];
                }
            });
        });
    };
    return BlackDuckAPICalls;
}());
exports.BlackDuckAPICalls = BlackDuckAPICalls;
