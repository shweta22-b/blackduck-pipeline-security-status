# Quick Command Reference

## Initial Setup & Publishing

```powershell
# 1. Navigate to action directory
cd "c:\Users\sbajpai\BD Action\blackduck-pipeline-security-status"

# 2. Verify build exists (should show dist/index.js)
ls bdscan\dist\index.js

# 3. Initialize git repository (if needed)
git init
git branch -M main

# 4. Add GitHub remote (REPLACE 'YourOrg' with your actual GitHub org/username)
git remote add origin https://github.com/YourOrg/blackduck-pipeline-security-status.git

# 5. Stage and commit all files
git add .
git commit -m "Initial release - Black Duck Security Scan Action v1.0.0"

# 6. Push to GitHub
git push -u origin main

# 7. Create release tags
git tag -a v1.0.0 -m "Release v1.0.0"
git tag -a v1 -m "Major version v1"

# 8. Push tags (this triggers the release workflow)
git push origin v1.0.0
git push origin v1
```

## Rebuilding the Action (if you make code changes)

```powershell
# Navigate to bdscan folder
cd "c:\Users\sbajpai\BD Action\blackduck-pipeline-security-status\bdscan"

# Install dependencies (first time only)
npm install

# Build
npm run build

# Run tests
npm test

# Go back to root and commit
cd ..
git add bdscan/dist/
git commit -m "chore: rebuild action"
git push
```

## Creating New Releases

```powershell
# After making changes and committing them
cd "c:\Users\sbajpai\BD Action\blackduck-pipeline-security-status"

# Create new version tag (increment version appropriately)
git tag -a v1.1.0 -m "Release v1.1.0 - Description of changes"
git push origin v1.1.0

# Update major version tag (so users on @v1 get the update)
git tag -fa v1 -m "Update v1 to v1.1.0"
git push origin v1 --force
```

## Verifying Setup

```powershell
# Check if dist is built
ls bdscan\dist\index.js

# Check git status
git status

# List all tags
git tag -l

# Verify action.yml syntax
cat action.yml
```

## Remember

1. **IMPORTANT**: Replace `YourOrg` in commands with your actual GitHub organization/username
2. The `bdscan/dist/` folder MUST be committed (already built and ready)
3. Repository MUST be public for others to use it
4. After first push, go to GitHub Releases and optionally publish to Marketplace
