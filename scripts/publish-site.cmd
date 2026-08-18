@echo off
setlocal

set "ROOT=%~dp0.."
set "NODE_BIN=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"

if exist "%NODE_BIN%\node.exe" (
  set "PATH=%NODE_BIN%;%ROOT%\scripts;%PATH%"
)

if not exist "%ROOT%\.git" (
  echo This folder is not connected to a git repository yet.
  exit /b 1
)

cd /d "%ROOT%"

echo Exporting content from local Payload CMS...
call "%ROOT%\scripts\pnpm.cmd" run export:content
if errorlevel 1 exit /b 1

echo Building static website...
call "%ROOT%\scripts\pnpm.cmd" --filter @portfolio/web run build:static
if errorlevel 1 exit /b 1

git status --short
git add .gitignore apps/web/src/app.css apps/web/src/routes/+page.svelte apps/web/src/lib/generated-content.json apps/web/src/lib/content.ts apps/cms/package.json apps/cms/next.config.ts apps/cms/tsconfig.json apps/cms/src/globals/Profile.ts apps/cms/src/seed.ts scripts/export-cms-content.mjs scripts/publish-site.cmd
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "chore: publish portfolio content"
) else (
  echo No content changes to commit.
)

git push
