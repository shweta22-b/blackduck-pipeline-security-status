# Migration Guide: Azure DevOps Task → GitHub Actions

## Overview
This guide will help you migrate your Black Duck security scanning from Azure DevOps to GitHub Actions.

## Quick Start

### 1. Install Dependencies
```bash
cd bdscan
npm install
```

### 2. Build the Action
```bash
npm run build
```

This will compile TypeScript to JavaScript in the `bdscan/dist/` directory.

### 3. Commit the Built Files
⚠️ **Important**: GitHub Actions require you to commit the compiled `dist/` folder.

```bash
git add bdscan/dist/
git commit -m "Add compiled action code"
git push
```

### 4. Set Up Secrets in GitHub
1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - Name: `BLACKDUCK_API_TOKEN`
   - Value: Your Black Duck API token

### 5. (Optional) Set Up Variables
If your Black Duck URL is different from the default:
1. Go to **Settings** → **Secrets and variables** → **Actions** → **Variables** tab
2. Add:
   - Name: `BLACKDUCK_URL`
   - Value: Your Black Duck server URL (e.g., `company.blackducksoftware.com`)

## Using the Action in Your Workflows

### Option 1: Reference from Same Repository
If the action is in the same repository as your code:

```yaml
- uses: ./
  with:
    blackduck-token: ${{ secrets.BLACKDUCK_API_TOKEN }}
    project-name: 'my-project'
    version-name: '1.0.0'
```

### Option 2: Reference from Another Repository
If you publish this action to a separate repository:

```yaml
- uses: your-org/blackduck-security-scan@v2
  with:
    blackduck-token: ${{ secrets.BLACKDUCK_API_TOKEN }}
    project-name: 'my-project'
    version-name: '1.0.0'
```

### Option 3: Use the Marketplace
To publish your action to GitHub Marketplace:
1. Make the repository public
2. Add proper versioning tags (e.g., `v2.0.0`)
3. Create a release
4. The action will be available in the GitHub Actions Marketplace

## Input Mapping Reference

| Azure DevOps | GitHub Actions | Notes |
|--------------|----------------|-------|
| `blackduckconnection` (service connection) | `blackduck-url` + `blackduck-token` | GitHub Actions doesn't have service connections; use secrets |
| `blackducktoken` | `blackduck-token` | Store in GitHub Secrets |
| `projectName` | `project-name` | Kebab-case naming |
| `versionName` | `version-name` | Kebab-case naming |
| `failOnSecurityRisks` | `fail-on-security-risks` | Kebab-case naming |
| `securityExclusions` | `security-exclusions` | Kebab-case naming |
| `failOnLicenseRisks` | `fail-on-license-risks` | Kebab-case naming |
| `licenseExclusions` | `license-exclusions` | Kebab-case naming |
| `failOnPolicyViolations` | `fail-on-policy-violations` | Kebab-case naming |
| `policyExclusions` | `policy-exclusions` | Kebab-case naming |

## Example Migration

### Before (Azure DevOps - azure-pipelines.yml)
```yaml
steps:
- task: alle-bd-sec-scan@2
  inputs:
    blackduckconnection: 'BlackDuck-ServiceConnection'
    projectName: $(Build.Repository.Name)
    versionName: $(Build.SourceBranchName)
    failOnSecurityRisks: true
    failOnLicenseRisks: true
    failOnPolicyViolations: true
```

### After (GitHub Actions - .github/workflows/security.yml)
```yaml
steps:
- uses: actions/checkout@v4

- uses: ./
  with:
    blackduck-url: ${{ vars.BLACKDUCK_URL }}
    blackduck-token: ${{ secrets.BLACKDUCK_API_TOKEN }}
    project-name: ${{ github.event.repository.name }}
    version-name: ${{ github.ref_name }}
    fail-on-security-risks: 'true'
    fail-on-license-risks: 'true'
    fail-on-policy-violations: 'true'
```

## Key Differences

### 1. Service Connections vs Secrets
- **Azure DevOps**: Uses service connections to store credentials
- **GitHub Actions**: Uses repository/organization secrets

### 2. Input Naming Convention
- **Azure DevOps**: camelCase (e.g., `projectName`)
- **GitHub Actions**: kebab-case (e.g., `project-name`)

### 3. Built-in Variables
- **Azure DevOps**: `$(Build.Repository.Name)`, `$(Build.SourceBranchName)`
- **GitHub Actions**: `${{ github.event.repository.name }}`, `${{ github.ref_name }}`

### 4. Dependencies
- **Azure DevOps**: Uses `azure-pipelines-task-lib`
- **GitHub Actions**: Uses `@actions/core`

## Testing the Action

### Local Testing (Before Push)
Build and verify compilation:
```bash
cd bdscan
npm run build
npm test
```

### Test in GitHub
1. Push your changes
2. Go to **Actions** tab in your repository
3. Manually trigger the workflow or push a commit
4. Check the logs for any errors

## Troubleshooting

### Issue: "Can't find action.yml"
- Ensure `action.yml` is in the repository root
- Check that you've committed all files

### Issue: "Module not found"
- Run `npm install` in the `bdscan/` directory
- Ensure `dist/` folder exists and contains compiled JavaScript
- Commit the `dist/` folder to Git

### Issue: "Input required and not supplied: blackduck-token"
- Verify the secret is added to repository settings
- Check the secret name matches exactly: `BLACKDUCK_API_TOKEN`
- Ensure you're using `${{ secrets.BLACKDUCK_API_TOKEN }}` in the workflow

## Support

For issues specific to the migration or GitHub Actions usage, refer to:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Creating JavaScript Actions](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)

## Next Steps

1. ✅ Build the action (`npm run build`)
2. ✅ Commit the `dist/` folder
3. ✅ Set up secrets in GitHub
4. ✅ Create a workflow file (or use the example provided)
5. ✅ Test the action
6. ✅ Migrate all your pipelines
