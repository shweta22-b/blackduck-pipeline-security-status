# Black Duck Security Scan GitHub Action

A GitHub Action to check Black Duck projects for security vulnerabilities, license risks, and policy violations during your CI/CD pipeline.

## Features

- 🔒 **Security Risk Detection**: Identify CRITICAL and HIGH security vulnerabilities
- 📜 **License Risk Checking**: Detect HIGH license risks
- 📋 **Policy Violation Monitoring**: Check for policy violations
- 🎯 **Flexible Exclusions**: Exclude specific components, licenses, or policies from checks
- ⚡ **Fast Integration**: Easy setup with minimal configuration

## Usage

### Basic Example

```yaml
name: Black Duck Security Scan
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Black Duck Security Scan
        uses: ./
        with:
          blackduck-token: ${{ secrets.BLACKDUCK_API_TOKEN }}
          project-name: 'my-project'
          version-name: '1.0.0'
          fail-on-security-risks: 'true'
          fail-on-license-risks: 'true'
          fail-on-policy-violations: 'true'
```

### Advanced Example with Exclusions

```yaml
- name: Black Duck Security Scan
  uses: ./
  with:
    blackduck-url: 'your-instance.blackducksoftware.com'
    blackduck-token: ${{ secrets.BLACKDUCK_API_TOKEN }}
    project-name: 'my-project'
    version-name: '1.0.0'
    fail-on-security-risks: 'true'
    security-exclusions: 'component-1, component-2'
    fail-on-license-risks: 'true'
    license-exclusions: 'MIT, Apache-2.0'
    fail-on-policy-violations: 'true'
    policy-exclusions: 'policy-name-1, policy-name-2'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `blackduck-url` | Black Duck server URL | No | `allegion.blackducksoftware.com` |
| `blackduck-token` | API token for Black Duck authentication | Yes | - |
| `project-name` | Name of the Black Duck project | Yes | - |
| `version-name` | Name of the Black Duck version | Yes | - |
| `fail-on-security-risks` | Fail action on CRITICAL or HIGH security risks | No | `false` |
| `security-exclusions` | Comma-separated list of security component names to exclude | No | `''` |
| `fail-on-license-risks` | Fail action on HIGH license risks | No | `false` |
| `license-exclusions` | Comma-separated list of licenses to exclude | No | `''` |
| `fail-on-policy-violations` | Fail action on policy violations | No | `false` |
| `policy-exclusions` | Comma-separated list of policy names to exclude | No | `''` |

## Setting up Secrets

1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add your Black Duck API token with the name `BLACKDUCK_API_TOKEN`

## How It Works

1. The action connects to your Black Duck instance using the provided API token
2. It retrieves the specified project and version data
3. Based on your configuration, it checks for:
   - Security vulnerabilities (CRITICAL and HIGH severity)
   - License risks (HIGH severity)
   - Policy violations
4. If any risks are found and the corresponding `fail-on-*` flag is set to `true`, the action will fail
5. You can exclude specific components, licenses, or policies using the exclusion inputs

## Migration from Azure DevOps

If you're migrating from the Azure DevOps task, here's a mapping of input names:

| Azure DevOps | GitHub Actions |
|--------------|----------------|
| `blackduckconnection` | Use `blackduck-url` and `blackduck-token` separately |
| `blackducktoken` | `blackduck-token` |
| `projectName` | `project-name` |
| `versionName` | `version-name` |
| `failOnSecurityRisks` | `fail-on-security-risks` |
| `securityExclusions` | `security-exclusions` |
| `failOnLicenseRisks` | `fail-on-license-risks` |
| `licenseExclusions` | `license-exclusions` |
| `failOnPolicyViolations` | `fail-on-policy-violations` |
| `policyExclusions` | `policy-exclusions` |

## Development

### Building the Action

```bash
cd bdscan
npm install
npm run build
```

### Running Tests

```bash
npm test
```

## License

ISC

## Support

For issues and questions, please open an issue in the repository.
