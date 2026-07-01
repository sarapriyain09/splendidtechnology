param(
    [ValidateSet("sqlite", "postgres")]
    [string]$Mode = "sqlite",
    [string]$PostgresUrl = "",
    [int]$Port = 8011,
    [switch]$DryRun
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
        $env:DATABASE_URL = "sqlite:///./app.db"
        Write-Host "Starting backend in SQLite mode on port $Port..."
    }
    else {
        if ([string]::IsNullOrWhiteSpace($PostgresUrl)) {
            throw "Postgres mode requires -PostgresUrl"
        }

        $env:DATABASE_URL = $PostgresUrl
        Write-Host "Starting backend in PostgreSQL mode on port $Port..."
    }

    $commandArgs = @("-m", "uvicorn", "app.main:app", "--reload", "--port", "$Port")

    if ($DryRun) {
        Write-Host "Dry run: & $pythonExe $($commandArgs -join ' ')"
        return
    }

    & $pythonExe @commandArgs
}
finally {
    Pop-Location
}
