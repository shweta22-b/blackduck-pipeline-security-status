# Publishing Your GitHub Action - Setup Guide

This guide will walk you through publishing the Black Duck Security Scan action to GitHub.

## Prerequisites

- ✅ A **public** GitHub repository (required for marketplace and cross-org usage)
- ✅ Git installed locally
- ✅ Node.js 20+ installed

## Step-by-Step Publishing Process

### 1. Repository Setup

**Option A: Create a New Repository**
1. Go to GitHub and create a new **public** repository named `blackduck-pipeline-security-status`
2. Do NOT initialize with README, .gitignore, or LICENSE (we already have these)

**Option B: Use Existing Repository**
- Make sure it's public (Settings → Danger Zone → Change visibility)

### 2. Initialize Git and Push Code

```powershell
# Navigate to your action directory
cd "c:\Users\sbajpai\BD Action\blackduck-pipeline-security-status"

# Initialize git (if not already done)
git init

# Add remote (replace YourOrg with your GitHub username/org)
git remote add origin https://github.com/YourOrg/blackduck-pipeline-security-status.git

# Stage all files
git add .

# First commit
git commit -m "Initial commit - Black Duck Security Scan Action"

# Push to GitHub
git push -u origin main
```

### 3. Build the Action

Before publishing, build the distributable:

```powershell
cd bdscan
npm install
npm run build
```

**Verify the build:**
```powershell
# Check that dist/index.js exists
ls dist/index.js
```

**Commit the built files:**
```powershell
git add dist/
git commit -m "Add built distribution"
git push
```

### 4. Create Your First Release

```powershell
# Create and push version tag
git tag -a v1.0.0 -m "Initial release - v1.0.0"
git push origin v1.0.0

# Create major version tag (so users can use @v1)
git tag -a v1 -m "Major version v1"
git push origin v1
```

The release workflow will automatically:
- Build the action
- Run tests
- Create a GitHub release
- Update the v1 tag

### 5. Publish to GitHub Marketplace (Optional)

1. Go to your repository on GitHub
2. Click on "Releases" → Find your v1.0.0 release
3. Click "Edit"
4. Check ☑️ "Publish this Action to the GitHub Marketplace"
5. Fill in the required information:
   - **Primary Category**: Code Quality
   - **Secondary Category**: Security
   - Agree to terms
6. Click "Update release"

### 6. Update README Usage Examples

After publishing, update the README to use your actual repository:

Replace `YourOrg` with your actual GitHub organization/username:
```yaml
uses: YourOrg/blackduck-pipeline-security-status@v1
```

## Usage by Other Organizations

Once published, anyone can use your action:

```yaml
steps:
  - name: Black Duck Security Scan
    uses: YourOrg/blackduck-pipeline-security-status@v1
    with:
      blackduck-token: ${{ secrets.BLACKDUCK_API_TOKEN }}
      project-name: 'my-project'
      version-name: 'main'
      fail-on-security-risks: 'true'
```

## Version Management

### Creating New Releases

When you make changes and want to release a new version:

```powershell
# Make your changes and commit them
git add .
git commit -m "feat: add new feature"
git push

# Create new version tag
git tag -a v1.1.0 -m "Release v1.1.0 - New features"
git push origin v1.1.0

# Update major version tag (so @v1 users get the update)
git tag -fa v1 -m "Update v1 to v1.1.0"
git push origin v1 --force
```

### Version Tag Strategy

- `v1.0.0` - Specific version (users can pin to exact version)
- `v1` - Major version (automatically gets minor/patch updates)
- `v1.1` - Minor version (automatically gets patch updates)

Users can choose their update strategy:
- `@v1` - Always get latest v1.x.x (recommended for most users)
- `@v1.1` - Get latest v1.1.x patches only
- `@v1.0.0` - Pin to exact version (never auto-update)

## Testing Your Published Action

Create a test workflow in any repository:

```yaml
# .github/workflows/test-action.yml
name: Test Black Duck Action
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: YourOrg/blackduck-pipeline-security-status@v1
        with:
          blackduck-token: ${{ secrets.BLACKDUCK_API_TOKEN }}
          project-name: 'test-project'
          version-name: 'test-version'
```

## Maintenance Checklist

- ✅ LICENSE file (MIT)
- ✅ README with usage examples
- ✅ action.yml with proper metadata
- ✅ Built dist/ folder committed
- ✅ .gitignore properly configured
- ✅ Release workflow configured
- ✅ Tests passing
- ✅ Repository is public

## Important Notes

1. **Always commit the `dist/` folder** - Users need it to run the action without building
2. **Use semantic versioning** - Major.Minor.Patch (e.g., v1.2.3)
3. **Test before releasing** - Run the build and test workflow
4. **Update major tags** - So users on @v1 get compatible updates
5. **Document breaking changes** - Use v2.0.0 for breaking changes

## Troubleshooting

### Issue: "Action not found"
- Ensure repository is public
- Verify the tag exists: `git tag -l`
- Check action.yml is at repository root

### Issue: "Cannot find module"
- Make sure `bdscan/dist/index.js` exists and is committed
- Rebuild: `cd bdscan && npm run build`

### Issue: "ENOENT: no such file or directory"
- Verify the `runs.main` path in action.yml matches your dist location
- Current path: `bdscan/dist/index.js`

## Next Steps

1. Build and commit the dist folder
2. Push to GitHub
3. Create v1.0.0 tag
4. Verify release workflow runs successfully
5. Test the action in another repository
6. (Optional) Publish to marketplace

## Support

For issues with publishing, check:
- [GitHub Actions documentation](https://docs.github.com/en/actions/creating-actions)
- [Publishing actions](https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace)
