# Zafar Store Deployment Guide

This file contains the essential information for connecting to the server and pushing code updates.

## 1. Connecting to the Server

Use the following details to connect to the production server:

- **IP Address**: `20.216.23.116`
- **Username**: `azureuser`
- **SSH Key Path**: `~/Downloads/zafarstore_key.pem`

**SSH Connection Command:**
```bash
ssh -i ~/Downloads/zafarstore_key.pem azureuser@20.216.23.116
```

---

## 2. Pushing Code Updates (Step-by-Step)

Follow these steps to deploy changes from your local machine to the live site.

### Step 1: Push to Main Branch
1. `git checkout main`
2. `git add .`
3. `git commit -m "Description of your changes"`
4. `git push origin main`

### Step 2: Push to Staging (Triggers Deployment)
The server pulling and deployment are triggered automatically when you push to `staging`.
1. `git checkout staging`
2. `git pull origin staging`
3. `git merge main`
4. `git push origin staging`

### Step 3: Back to Development
1. `git checkout main`

---

## 3. Handling Process Failures

If any command fails or gets stuck (e.g., an editor opens during a merge):

1. **Terminate the Process**: You can stop a stuck command by pressing `Ctrl + C` or closing the terminal.
2. **Abort Merge**: If a merge goes wrong or gets stuck in a "Merge conflict" or "Editor" state, run:
   ```bash
   git merge --abort
   ```
3. **Check Status**: Always run `git status` to see what state your repository is in before trying again.
