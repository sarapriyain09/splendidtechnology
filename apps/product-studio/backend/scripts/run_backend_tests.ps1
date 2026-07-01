param(
    [ValidateSet("sqlite", "postgres")]
    [string]$Mode = "sqlite",
    [string]$PostgresUrl = ""
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Split-Path -Parent $scriptDir
$repoRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $backendDir))
$pythonExe = Join-Path $repoRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $pythonExe)) {
    throw "Python executable not found at $pythonExe"
}

Push-Location $backendDir
try {
    if ($Mode -eq "sqlite") {
        Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
        Write-Host "Running backend tests in SQLite mode (default test profile)..."
    }
    else {
        if ([string]::IsNullOrWhiteSpace($PostgresUrl)) {
            throw "Postgres mode requires -PostgresUrl"
        }

        $env:DATABASE_URL = $PostgresUrl
        Write-Host "Running backend tests in PostgreSQL mode..."
    }

    & $pythonExe -m pytest -q
}
finally {
    Pop-Location
}
