param(
  [string]$PiUser = "sarapriyain",
  [string]$PiHost = "192.168.0.64",
  [string]$SourceDir = "apps/website",
  [string]$RemoteDir = "/home/sarapriyain/Projects/velynxia-site",
  [int]$Port = 3050,
  [string]$Pm2Name = "velynxia-site"
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$sourcePath = Resolve-Path (Join-Path $repoRoot $SourceDir)
$bundlePath = Join-Path ([System.IO.Path]::GetTempPath()) "velynxia-site-deploy.tgz"
$remoteBundle = "/home/$PiUser/velynxia-site-deploy.tgz"

Write-Host "Packing source from $sourcePath ..."

tar -czf $bundlePath --exclude=node_modules --exclude=.next --exclude=.git --exclude=stripe-sample-code.zip -C $sourcePath .

Write-Host "Uploading bundle to $PiUser@$PiHost ..."
$scpTarget = "{0}@{1}:{2}" -f $PiUser, $PiHost, $remoteBundle
scp $bundlePath $scpTarget

Write-Host "Deploying on Pi and restarting PM2 ..."
$remoteCmd = @(
  "set -e",
  "mkdir -p '$RemoteDir'",
  "tar -xzf '$remoteBundle' -C '$RemoteDir'",
  "cd '$RemoteDir'",
  "if [ ! -f .env.local ] && [ -f .env.local.example ]; then cp .env.local.example .env.local; fi",
  "grep -q '^NEXT_PUBLIC_SITE_URL=' .env.local 2>/dev/null && sed -i 's|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://velynxia.com|' .env.local || echo 'NEXT_PUBLIC_SITE_URL=https://velynxia.com' >> .env.local",
  "npm ci",
  "npm run build",
  "if pm2 describe '$Pm2Name' >/dev/null 2>&1; then pm2 restart '$Pm2Name'; else PORT=$Port pm2 start npm --name '$Pm2Name' --cwd '$RemoteDir' -- start; fi",
  "pm2 save",
  "curl -sSI http://127.0.0.1:$Port | sed -n '1,12p'"
) -join "; "

ssh "${PiUser}@${PiHost}" $remoteCmd

Write-Host "Done. Pi deploy completed for $Pm2Name on port $Port."
