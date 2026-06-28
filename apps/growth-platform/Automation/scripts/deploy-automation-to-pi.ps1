param(
  [string]$PiHost = "sarapriyain@192.168.0.64",
  [string]$RemoteRoot = "/home/sarapriyain/Projects/app/automation",
  [string]$Pm2App = "automation",
  [int]$Port = 3030,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\\..")
Set-Location $repoRoot

$archivePath = Join-Path $repoRoot "automation-app.tar"

function Assert-LastExit([string]$step) {
  if ($LASTEXITCODE -ne 0) {
    throw "$step failed with exit code $LASTEXITCODE"
  }
}

Write-Host "==> Building deploy archive" -ForegroundColor Cyan
if (Test-Path $archivePath) {
  Remove-Item $archivePath -Force
}

tar --exclude=node_modules --exclude=.next --exclude=automation-app.tar -cf $archivePath .
Assert-LastExit "Create tar archive"

Write-Host "==> Uploading archive to Pi" -ForegroundColor Cyan
scp $archivePath "$PiHost`:/tmp/automation-app.tar"
Assert-LastExit "Upload archive"

$skipBuildRemote = if ($SkipBuild) { "1" } else { "0" }

$remoteCommands = @(
  "set -e",
  "mkdir -p '$RemoteRoot'",
  "cd '$RemoteRoot'",
  "tar -xf /tmp/automation-app.tar",
  "if [ -f /home/sarapriyain/Projects/app-growth/.env ]; then cp -f /home/sarapriyain/Projects/app-growth/.env .env; fi",
  "if [ -f /home/sarapriyain/Projects/app-growth/.env.local ]; then cp -f /home/sarapriyain/Projects/app-growth/.env.local .env.local; fi",
  "npm install",
  "npm run db:generate",
  "if [ '$skipBuildRemote' = '0' ]; then npm run build; fi",
  "if pm2 describe '$Pm2App' >/dev/null 2>&1; then pm2 restart '$Pm2App' --update-env; else NEXTAUTH_URL=https://automation.velynxia.com PORT=$Port pm2 start npm --name '$Pm2App' --cwd '$RemoteRoot' -- run start -- -p $Port; fi",
  "pm2 save",
  "pm2 describe '$Pm2App'"
)

$remoteCommand = ($remoteCommands -join "; ")

Write-Host "==> Deploying and restarting PM2" -ForegroundColor Cyan
ssh $PiHost $remoteCommand
Assert-LastExit "Remote deploy"

Write-Host "==> Verifying login endpoint" -ForegroundColor Cyan
ssh $PiHost "curl -sI http://127.0.0.1:$Port/app/login | head -n 5"
Assert-LastExit "Health check"

if (Test-Path $archivePath) {
  Remove-Item $archivePath -Force
}

Write-Host "Automation deployment complete." -ForegroundColor Green
