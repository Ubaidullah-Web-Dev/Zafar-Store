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

### Step 0: Build locally
Before pushing any changes, you must build the assets locally:
1. `npm run build`

### Step 1: Push to Main Branch
1. `git checkout main`
2. `git add .`
3. `git commit -m "Description of your changes"`
4. `git push origin main`

### Step 2: Push to Staging
1. `git checkout staging`
2. `git pull origin staging`
3. `git merge main`
4. `git push origin staging`

### Step 3: Pull on Server
After pushing to staging, connect to the server and pull the changes manually:
1. `ssh -i ~/Downloads/zafarstore_key.pem azureuser@20.216.23.116`
2. `cd /var/www/zafarstore`
3. `git checkout staging`
4. `git pull origin staging`
5. `php artisan migrate --force` (To apply database changes)
6. `php artisan optimize:clear` (To clear any cached files)

### Step 4: Back to Development
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
