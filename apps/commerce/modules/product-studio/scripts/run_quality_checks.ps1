param(
    [ValidateSet("local", "full")]
    [string]$Mode = "local"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$appDir = Split-Path -Parent $scriptDir
$backendDir = Join-Path $appDir "backend"
$frontendDir = Join-Path $appDir "frontend"

$backendChecksScript = Join-Path $backendDir "scripts\run_backend_tests.ps1"
$frontendChecksScript = Join-Path $frontendDir "scripts\run_frontend_checks.ps1"

if (-not (Test-Path $backendChecksScript)) {
    throw "Backend checks script not found at $backendChecksScript"
}

if (-not (Test-Path $frontendChecksScript)) {
    throw "Frontend checks script not found at $frontendChecksScript"
}

Write-Host "Running backend checks (sqlite)..."
Push-Location $backendDir
try {
    & $backendChecksScript -Mode sqlite
}
finally {
    Pop-Location
}

if ($Mode -eq "local") {
    Write-Host "Running frontend unit checks..."
    Push-Location $frontendDir
    try {
        & $frontendChecksScript -Mode unit
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "Running frontend full checks (unit + e2e)..."
    Push-Location $frontendDir
    try {
        & $frontendChecksScript -Mode all
    }
    finally {
        Pop-Location
    }
}
