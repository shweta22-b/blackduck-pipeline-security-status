import { IBlackDuckVersion } from "../../src/models/IBlackDuckVersion";
import { IBlackDuckViolations } from "../../src/models/IBlackDuckViolations";
import { IBlackDuckProject } from "../../src/models/IBlackDuckProject";
import { ProjectItem, Link } from "../../src/models/ISharedItems";

export const mockProjectResponse:IBlackDuckProject = {
    "totalCount": 1,
    "items": [{
    "name": "ProjectName",
    "projectLevelAdjustments": true,
        "cloneCategories": ["COMPONENT_DATA",
            "VULN_DATA"],
    "customSignatureEnabled": false,
    "customSignatureDepth": 5,
    "deepLicenseDataEnabled": false,
    "snippetAdjustmentApplied": false,
    "licenseConflictsEnabled": false,
    "createdAt": "2021-07-13T17:00:00.000Z",
    "createdBy": "jbeck@allegion.com",
    "createdByUser": "https://localhost/api/users/USERGUID123",
    "updatedAt": "2021-07-13T17:00:00.000Z",
    "updatedBy": "jbeck@allegion.com",
    "updatedByUser": "https://localhost/api/users/USERGUID123",
    "source": "CUSTOM",
    "_meta": {
        "allow": ["GET"],
        "href": "https://localhost/api/projects/PROJECTGUID123",
        "links": [ {
            "rel": "versions",
            "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123"
            }]
        }
    }],
    "appliedFilters": [],
    "_meta": {
        "allow": ['GET'],
        "href": "https://localhost:5000",
        "links": [{
            "rel": "versions",
            "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123",
            "name": "subscribed",
            "label": "Subscribed"
        }]
    }
}

export const mockVersionResponse:IBlackDuckVersion = {
    "totalCount": 1,
        "items": [
        {
            "createdAt": "2021-07-13T17:00:00.000Z",
            "createdBy": "jbeck@allegion.com",
            "createdByUser": "https://localhost/api//users/USERGUID123",
            "settingUpdatedAt": "2021-10-25T13:10:29.482Z",
            "settingUpdatedBy": "jbeck@allegion.com",
            "settingUpdatedByUser": "https://localhost/api//users/USERGUID123",
            "versionName": "master-CIBuild",
            "source": "CUSTOM",
            "phase": "DEVELOPMENT",
            "distribution": "EXTERNAL",
            "_meta": {
                "allow": [
                    "GET",
                    "PUT"
                ],
                "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123",
                "links": [
                    {
                        "rel": "bulk-adjustment",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/bulk-adjustment"
                    },
                    {
                        "rel": "source-trees",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/source-trees"
                    },
                    {
                        "rel": "snippet-counts",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/snippet-counts"
                    },
                    {
                        "rel": "vulnerability-bom",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/vulnerability-bom"
                    },
                    {
                        "rel": "version-risk-profile",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/risk-profile"
                    },
                    {
                        "rel": "origin-risk-profile",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/origin-risk-profile"
                    },
                    {
                        "rel": "references",
                        "href": "https://localhost/api/components/PROJECTGUID123/versions/VERSIONGUID123/references"
                    },
                    {
                        "rel": "versionReport",
                        "href": "https://localhost/api/versions/VERSIONGUID123/reports"
                    },
                    {
                        "rel": "licenseReports",
                        "href": "https://localhost/api/versions/VERSIONGUID123/license-reports"
                    },
                    {
                        "rel": "riskProfile",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/risk-profile"
                    },
                    {
                        "rel": "version-risk-profile",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/risk-profile"
                    },
                    {
                        "rel": "origin-risk-profile",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/origin-risk-profile"
                    },
                    {
                        "rel": "components",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/components"
                    },
                    {
                        "rel": "vulnerable-components",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/vulnerable-bom-components"
                    },
                    {
                        "rel": "comparison",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/comparison"
                    },
                    {
                        "rel": "project",
                        "href": "https://localhost/api/projects/PROJECTGUID123"
                    },
                    {
                        "rel": "policy-status",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/policy-status"
                    },
                    {
                        "rel": "codelocations",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/codelocations"
                    },
                    {
                        "rel": "custom-fields",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/custom-fields"
                    },
                    {
                        "rel": "issues",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/issues"
                    },
                    {
                        "rel": "project-version-journal",
                        "href": "https://localhost/api/journal/projects/PROJECTGUID123/versions/VERSIONGUID123"
                    },
                    {
                        "rel": "bom-status",
                        "href": "https://localhost/api/projects/PROJECTGUID123/versions/VERSIONGUID123/bom-status"
                    }
                ]
            },
            "license": {
                "type": "DISJUNCTIVE",
                "licenses": [
                    {
                        "license": "https://localhost/api/licenses/00000000-0010-0000-0000-000000000000",
                        "licenses": [],
                        "name": "Unknown License",
                        "ownership": "UNKNOWN",
                        "licenseDisplay": "Unknown License",
                        "licenseFamilySummary": {
                            "name": "Unknown",
                            "href": "https://localhost/api/license-families/5"
                        }
                    }
                ],
                "licenseDisplay": "Unknown License"
            },
            "securityRiskProfile": {
                "counts": [
                    {
                        "countType": "CRITICAL",
                        "count": 1
                    },
                    {
                        "countType": "HIGH",
                        "count": 0
                    },
                    {
                        "countType": "MEDIUM",
                        "count": 2
                    },
                    {
                        "countType": "LOW",
                        "count": 5
                    },
                    {
                        "countType": "OK",
                        "count": 422
                    },
                    {
                        "countType": "UNKNOWN",
                        "count": 0
                    }
                ]
            },
            "licenseRiskProfile": {
                "counts": [
                    {
                        "countType": "HIGH",
                        "count": 1
                    },
                    {
                        "countType": "MEDIUM",
                        "count": 137
                    },
                    {
                        "countType": "LOW",
                        "count": 0
                    },
                    {
                        "countType": "OK",
                        "count": 291
                    },
                    {
                        "countType": "UNKNOWN",
                        "count": 0
                    }
                ]
            },
            "operationalRiskProfile": {
                "counts": [
                    {
                        "countType": "HIGH",
                        "count": 44
                    },
                    {
                        "countType": "MEDIUM",
                        "count": 101
                    },
                    {
                        "countType": "LOW",
                        "count": 135
                    },
                    {
                        "countType": "OK",
                        "count": 149
                    },
                    {
                        "countType": "UNKNOWN",
                        "count": 0
                    }
                ]
            },
            "policyStatus": "IN_VIOLATION",
            "policyStatusSummaries": [
                {
                    "name": "Apache v2",
                    "status": "IN_VIOLATION"
                },
                {
                    "name": "Unknown License",
                    "status": "IN_VIOLATION"
                }
            ],
            "lastBomUpdateDate": "2021-10-25T13:10:29.099Z",
            "lastScanDate": "2021-10-25T13:10:29.115Z"
        }
    ],
        "appliedFilters": [],
            "_meta": {
    "allow": [
        "POST",
        "GET"
    ],
        "href": "https://localhost/api/projects/PROJECTGUID123/versions",
            "links": [
                {
                    "rel": "static-filter",
                    "href": "https://localhost/api/projects/PROJECTGUID123/versions-filters?filterKey=distribution",
                    "name": "distribution",
                    "label": "Distribution"
                },
                {
                    "rel": "dynamic-filter",
                    "href": "https://localhost/api/projects/PROJECTGUID123/versions-filters?filterKey=license",
                    "name": "license",
                    "label": "License"
                },
                {
                    "rel": "static-filter",
                    "href": "https://localhost/api/projects/PROJECTGUID123/versions-filters?filterKey=licenseRisk",
                    "name": "licenseRisk",
                    "label": "License Risk"
                },
                {
                    "rel": "static-filter",
                    "href": "https://localhost/api/projects/PROJECTGUID123/versions-filters?filterKey=operationalRisk",
                    "name": "operationalRisk",
                    "label": "Operational Risk"
                },
                {
                    "rel": "static-filter",
                    "href": "https://localhost/api/projects/PROJECTGUID123/versions-filters?filterKey=phase",
                    "name": "phase",
                    "label": "Release Phase"
                },
                {
                    "rel": "static-filter",
                    "href": "https://localhost/api/projects/PROJECTGUID123/versions-filters?filterKey=securityRisk",
                    "name": "securityRisk",
                    "label": "Security Risk"
                }
            ]
    }
}