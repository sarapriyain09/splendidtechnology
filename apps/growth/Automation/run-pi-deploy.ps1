param(
  [string]$PiHost = "sarapriyain@192.168.0.64",
  [string]$RemoteRoot = "/home/sarapriyain/Projects/app/automation",
  [string]$Pm2App = "automation",
  [int]$Port = 3030,
  [switch]$SkipBuild
)

$scriptPath = Join-Path $PSScriptRoot "scripts/deploy-automation-to-pi.ps1"

& $scriptPath `
  -PiHost $PiHost `
  -RemoteRoot $RemoteRoot `
  -Pm2App $Pm2App `
  -Port $Port `
  -SkipBuild:$SkipBuild
