param(
  [string]$PiHost = "sarapriyain@192.168.0.64",
  [string]$RemoteRoot = "/home/sarapriyain/Projects/app/analytics",
  [string]$Pm2App = "analytics",
  [int]$Port = 3040,
  [switch]$SkipBuild
)

$scriptPath = Join-Path $PSScriptRoot "scripts/deploy-analytics-to-pi.ps1"

& $scriptPath `
  -PiHost $PiHost `
  -RemoteRoot $RemoteRoot `
  -Pm2App $Pm2App `
  -Port $Port `
  -SkipBuild:$SkipBuild
