param(
    [ValidateSet("unit", "e2e", "all")]
    [string]$Mode = "unit"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Split-Path -Parent $scriptDir

Push-Location $frontendDir
try {
    if ($Mode -eq "unit" -or $Mode -eq "all") {
        Write-Host "Running frontend unit tests..."
        npm run test:unit
    }

    if ($Mode -eq "e2e" -or $Mode -eq "all") {
        Write-Host "Running frontend e2e tests..."
        npm run test:e2e
    }
}
finally {
    Pop-Location
}
