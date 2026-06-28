param(
  [string]$PiUser = "sarapriyain",
  [string]$PiHost = "192.168.0.64",
  [string]$SourceDir = "apps/growth-platform",
  [string]$RemoteDir = "/home/sarapriyain/Projects/app-growth",
  [int]$Port = 3020,
  [string]$Pm2Name = "app-growth"
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$sourcePath = Resolve-Path (Join-Path $repoRoot $SourceDir)
$bundlePath = Join-Path ([System.IO.Path]::GetTempPath()) "app-growth-deploy.tgz"
$remoteBundle = "/home/$PiUser/app-growth-deploy.tgz"

Write-Host "Packing growth platform from $sourcePath ..."

tar -czf $bundlePath --exclude=node_modules --exclude=.next --exclude=.git --exclude=.env --exclude=.env.local --exclude=*.zip --exclude=*.tar --exclude=*.tgz -C $sourcePath .

Write-Host "Uploading bundle to $PiUser@$PiHost ..."
scp $bundlePath "$PiUser@$PiHost:$remoteBundle"

Write-Host "Deploying growth platform on Pi ..."
$remoteCmd = @"
set -e
mkdir -p '$RemoteDir'
tar -xzf '$remoteBundle' -C '$RemoteDir'
cd '$RemoteDir'
npm ci
npm run build
if pm2 describe '$Pm2Name' >/dev/null 2>&1; then
  pm2 restart '$Pm2Name'
else
  PORT=$Port pm2 start npm --name '$Pm2Name' --cwd '$RemoteDir' -- start
fi
pm2 save
curl -sSI http://127.0.0.1:$Port | sed -n '1,12p'
"@

ssh "$PiUser@$PiHost" $remoteCmd

Write-Host "Done. Pi deploy completed for $Pm2Name on port $Port."
