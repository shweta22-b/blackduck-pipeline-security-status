"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
exports.BlackDuckCheck = void 0;
var BlackDuckAPICalls_1 = require("./BlackDuckAPICalls");
var BlackDuckCheck = (function (_super) {
    __extends(BlackDuckCheck, _super);
    function BlackDuckCheck(_bdToken, _bdProjectName, _bdVersionName, _baseUrl) {
        return _super.call(this, _bdToken, _bdProjectName, _bdVersionName, _baseUrl) || this;
    }
    BlackDuckCheck.prototype.failOnSecurityRisks = function (bdData, exclusionList) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, violationUrl, securityRisks, severityCheck, riskAssessment, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Checking for security risks...");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        message = void 0;
                        result = [];
                        violationUrl = "".concat(bdData.items[0]._meta.href, "/components?filter=securityRisk%3Ahigh&filter=securityRisk%3Acritical");
                        console.log("Querying security risks at: ".concat(violationUrl));
                        return [4, this.getViolations(violationUrl, this.bearerToken)];
                    case 2:
                        securityRisks = _a.sent();
                        console.log("Security risks found: ".concat(securityRisks.totalCount));
                        severityCheck = securityRisks.totalCount > 0 ? true : false;
                        if (!(severityCheck && exclusionList.length > 0)) return [3, 4];
                        return [4, this.checkExclusions(exclusionList, securityRisks.items, securityRisks.totalCount, "security")];
                    case 3:
                        result = _a.sent();
                        return [3, 7];
                    case 4:
                        if (!severityCheck) return [3, 6];
                        message = "Critical or high security risks detected";
                        console.log(message);
                        return [4, this.listComponents(securityRisks.items, securityRisks.totalCount, "security")];
                    case 5:
                        result = _a.sent();
                        return [3, 7];
                    case 6:
                        message = "No critical or high security risks detected";
                        riskAssessment = {
                            risk: severityCheck,
                            message: message
                        };
                        result.push(riskAssessment);
                        _a.label = 7;
                    case 7: return [2, result];
                    case 8:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3, 9];
                    case 9: return [2];
                }
            });
        });
    };
    BlackDuckCheck.prototype.failOnLicenseRisks = function (bdData, exclusionList) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, licenseUrl, licenseRisks, licenseCheck, riskAssessment, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Checking for license risks...");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        message = void 0;
                        result = [];
                        licenseUrl = "".concat(bdData.items[0]._meta.href, "/components?filter=licenseRisk%3Ahigh&filter=licenseRisk%3Acritical");
                        return [4, this.getViolations(licenseUrl, this.bearerToken)];
                    case 2:
                        licenseRisks = _a.sent();
                        licenseCheck = licenseRisks.totalCount > 0 ? true : false;
                        if (!(licenseCheck && exclusionList.length > 0)) return [3, 4];
                        message = "A critical or high license risk was detected";
                        return [4, this.checkExclusions(exclusionList, licenseRisks.items, licenseRisks.totalCount, "license")];
                    case 3:
                        result = _a.sent();
                        return [3, 7];
                    case 4:
                        if (!licenseCheck) return [3, 6];
                        message = "A critical or high license risk was detected";
                        return [4, this.listComponents(licenseRisks.items, licenseRisks.totalCount, "license")];
                    case 5:
                        result = _a.sent();
                        return [3, 7];
                    case 6:
                        message = "No critical or high license risks were detected";
                        riskAssessment = {
                            risk: licenseCheck,
                            message: message
                        };
                        console.log(message);
                        result.push(riskAssessment);
                        _a.label = 7;
                    case 7: return [2, result];
                    case 8:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3, 9];
                    case 9: return [2];
                }
            });
        });
    };
    BlackDuckCheck.prototype.failOnPolicyViolations = function (versionDetails, exclusionList, policySeverities) {
        return __awaiter(this, void 0, void 0, function () {
            var policyVersionRisk, message, result, policyUrl, severityFilters, policyRisks, poilicyCheck, riskAssessment, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Checking for policy violations...");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        policyVersionRisk = versionDetails.items[0].policyStatusSummaries;
                        message = void 0;
                        result = [];
                        policyUrl = "".concat(versionDetails.items[0]._meta.href, "/components?filter=bomPolicy%3Ain_violation");
                        if (policySeverities && policySeverities.length > 0) {
                            severityFilters = policySeverities.map(function (s) { return "filter=policySeverity%3A".concat(s.toLowerCase()); }).join('&');
                            policyUrl += "&".concat(severityFilters);
                            console.log("Filtering policy violations by severities: ".concat(policySeverities.join(', ')));
                        }
                        console.log("Querying policy violations at: ".concat(policyUrl));
                        return [4, this.getViolations(policyUrl, this.bearerToken)];
                    case 2:
                        policyRisks = _a.sent();
                        poilicyCheck = policyRisks.totalCount > 0 ? true : false;
                        if (!(poilicyCheck && exclusionList.length > 0)) return [3, 4];
                        return [4, this.checkExclusions(exclusionList, policyRisks.items, policyRisks.totalCount, "policy")];
                    case 3:
                        result = _a.sent();
                        return [3, 7];
                    case 4:
                        if (!poilicyCheck) return [3, 6];
                        message = "A policy violation was detected";
                        return [4, this.listComponents(policyRisks.items, policyRisks.totalCount, "policy")];
                    case 5:
                        result = _a.sent();
                        return [3, 7];
                    case 6:
                        message = "No policy violations were detected";
                        riskAssessment = {
                            risk: poilicyCheck,
                            message: message
                        };
                        console.log(message);
                        result.push(riskAssessment);
                        _a.label = 7;
                    case 7: return [2, result];
                    case 8:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3, 9];
                    case 9: return [2];
                }
            });
        });
    };
    BlackDuckCheck.prototype.checkExclusions = function (exclusionList, risks, violationCount, label) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, _i, risks_1, component, riskAssessment, riskAssessment;
            return __generator(this, function (_a) {
                result = [];
                for (_i = 0, risks_1 = risks; _i < risks_1.length; _i++) {
                    component = risks_1[_i];
                    riskAssessment = void 0;
                    if (exclusionList.includes(component.componentName)) {
                        message = "EXCLUDED: ".concat(component.componentName, " from ").concat(label, " risk assessment.");
                        console.log(message);
                        riskAssessment = {
                            risk: false,
                            message: message
                        };
                        result.push(riskAssessment);
                    }
                    else {
                        message = "".concat(component.componentName, " is a ").concat(label, " risk.");
                        console.log(message);
                        riskAssessment = {
                            risk: true,
                            message: message
                        };
                        result.push(riskAssessment);
                    }
                }
                if (violationCount > 10) {
                    riskAssessment = void 0;
                    message = "More than ".concat(violationCount, " ").concat(label, " risks were found.");
                    console.log(message);
                    riskAssessment = {
                        risk: true,
                        message: message
                    };
                    result.push(riskAssessment);
                }
                return [2, result];
            });
        });
    };
    BlackDuckCheck.prototype.listComponents = function (risks, violationCount, label) {
        return __awaiter(this, void 0, void 0, function () {
            var message, result, _i, risks_2, component, riskAssessment, riskAssessment;
            return __generator(this, function (_a) {
                result = [];
                for (_i = 0, risks_2 = risks; _i < risks_2.length; _i++) {
                    component = risks_2[_i];
                    riskAssessment = void 0;
                    message = "".concat(component.componentName, " is a ").concat(label, " risk.");
                    console.log(message);
                    riskAssessment = {
                        risk: true,
                        message: message
                    };
                    result.push(riskAssessment);
                }
                if (violationCount > 10) {
                    riskAssessment = void 0;
                    message = "More than ".concat(violationCount, " ").concat(label, " risks were found.");
                    console.log(message);
                    riskAssessment = {
                        risk: true,
                        message: message
                    };
                    result.push(riskAssessment);
                }
                return [2, result];
            });
        });
    };
    return BlackDuckCheck;
}(BlackDuckAPICalls_1.BlackDuckAPICalls));
exports.BlackDuckCheck = BlackDuckCheck;
