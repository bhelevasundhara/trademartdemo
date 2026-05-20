# Standard Operating Procedure: Git & GitHub Team Workflow

**This document outlines the step-by-step workflow for setting up, collaborating on, and managing our Next.js frontend projects using Git and GitHub.**

---

## Phase 1: Initial Setup
* **Assignee:** Everyone | **Frequency:** Once per machine

Before writing any code, ensure Git is correctly installed and configured on your local machine.

### 1. Install Git
* **Windows/Mac/Linux:** Download and install the latest version from [git-scm.com](https://git-scm.com/).

### 2. Verify Installation
Open your terminal (Mac: Terminal, Windows: PowerShell) and run:
```powershell
git --version
# Output should resemble: git version 2.44.0
```

### 3. Configure Your Git Profile
Set your global identity (this stamps your name on all commits you write):
```powershell
git config --global user.name "Your Full Name"
git config --global user.email "you@gmail.com"
```

---

## Phase 2: Project Initialization
* **Assignee:** Vasundhara | **Frequency:** Once per project lifetime

> [!IMPORTANT]
> ### ✅ **PHASE 2 COMPLETED BY VASUNDHARA**
> **This phase has already been completed!** New teammates joining the project should **SKIP** these steps and proceed directly to **[Phase 3: Teammate Onboarding](#phase-3-teammate-onboarding)** below.

> [!CAUTION]
> ### 🚨 **CRITICAL WARNING: WHERE TO RUN COMMANDS**
> **Never** run project initialization commands directly inside your user folder (e.g., `C:\Users\yourname`). 
> Instead, create a dedicated folder for coding projects (e.g., `C:\Projects`) and navigate inside it before starting:
> ```powershell
> mkdir C:\Projects
> cd C:\Projects
> ```

### 1. Create the GitHub Repository (Browser)
1. Go to [github.com](https://github.com) → Click the **`+`** icon → **New repository**.
2. **Repository name:** `indiantrademart-frontend`
3. **Visibility:** Private
4. **Add .gitignore / README:** Leave these unchecked (Next.js will generate these for you).
5. Click **Create repository**.
6. **Add Teammates:** Go to **Settings** → **Collaborators** → **Add people** → Add teammates by username.

### 2. Scaffold & Push Next.js Project (Terminal)
From your dedicated projects directory (e.g., `C:\Projects`), run the following:

```powershell
# 1. Scaffold the app
npx create-next-app@latest trademartdemo
# Answer the prompts: Yes to TypeScript, Tailwind, and App Router.

# 2. CD into the newly created folder (CRITICAL!)
cd trademartdemo

# 3. Link to the newly created GitHub repository
git remote add origin https://github.com/bhelevasundhara/trademartdemo.git

# 4. Ensure your default branch is explicitly named 'main'
git branch -M main

# 5. Push initial code
git push -u origin main
```

### 3. Create the Shared Develop Branch
Develop is the shared branch where code is integrated before hitting `main`.
```powershell
# Create 'develop' branch off of main and switch to it
git checkout -b develop

# Push develop to GitHub
git push -u origin develop
```

### 4. Protect the Shared Branches (Browser)
Go to GitHub **Settings** → **Branches** (or **Rules**) → **Add rule**.
1. **Branch name pattern:** Type `main`
2. Check **"Require a pull request before merging"**
3. Check **"Require approvals"** (optional, but recommended)
4. Repeat the exact same process for the **`develop`** branch.

---

## Phase 3: Teammate Onboarding
* **Assignee:** Teammates | **Frequency:** Once per project

Download the project and start the development server.

### 1. Clone the repository
```powershell
git clone https://github.com/bhelevasundhara/trademartdemo.git
cd trademartdemo
```

### 2. Setup Dependencies & Run
```powershell
# Install packages listed in package.json
npm install

# Start local dev server
npm run dev
```
Visit `http://localhost:3000` in your browser to see the app running locally.

---

## Phase 4: The Daily Developer Workflow
* **Assignee:** Everyone | **Frequency:** Every day

### 1. Morning Sync: Pull Latest Team Changes
Always start by pulling down recent updates from your teammates.
```powershell
git checkout develop
git pull origin develop
```

### 2. Start Work: Create a Clean Feature Branch
Never write code directly on `main` or `develop`. Always create a dedicated branch.
* **Naming Convention:** `feature/<your-name>/<short-task-description>`
```powershell
git checkout -b feature/Folder/buyer-dashboard
```

### 3. Save Work Regularly
Create checkpoints throughout the day. Do not wait until the end of the day to push code.
```powershell
git status  # See what files changed
git add .
git commit -m "feat: implement supplier search UI"
git push origin feature/Folder/buyer-dashboard
```

### 4. Finish Feature & Open a Pull Request (PR)
When your feature is tested and ready:
1. Go to the GitHub repository in your browser.
2. Click the yellow banner: **"Compare & pull request"**.
3. **CRITICAL ROUTING Check:**
   * **Base:** `develop` 
   * **Compare:** `feature/Folder/buyer-dashboard`
4. Fill out a clear title and description of the changes made.
5. Click **Create Pull Request**.
6. Ask a teammate to review and approve it. Once approved, click **Merge**.

---

## Phase 5: Handling Merge Conflicts
* **Assignee:** Everyone | **Frequency:** As needed

A conflict occurs when Git cannot automatically merge code because two people edited the exact same line.

### 1. Bring `develop` into your current branch:
```powershell
# Get latest data without changing your active branch
git fetch origin

# Merge remote develop into your CURRENT feature branch
git merge origin/develop
```

### 2. Resolve the Conflict in VS Code:
Git will pause the merge and list conflicting files in red. Open them.
VS Code will highlight the conflicts:
```text
<<<<<<< HEAD (Your Changes)
const buttonColor = "blue";
=======
const buttonColor = "indigo";
>>>>>>> origin/develop (Their Changes)
```
* Use the inline VS Code buttons: **"Accept Current Change"**, **"Accept Incoming"**, or **"Accept Both"**.
* Save the file.

### 3. Commit the Resolution:
```powershell
git add .
git commit -m "fix: resolve merge conflicts with develop"
git push origin feature/your-name/task-name
```

---

## Appendix: Cheat Sheet

| Command | What it does |
| :--- | :--- |
| `git status` | Shows modified, unstaged, or untracked files. |
| `git log --oneline -n 5` | Shows a compact list of your last 5 commits. |
| `git switch branch-name` | Safely switches to an existing branch. |
| `git restore <filename>` | Discards changes you made locally to a specific file. |
| `git remote -v` | Shows where your local folder is connected on the web. |
