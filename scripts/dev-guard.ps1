# MyBlog dev server guard script (Windows)
# Purpose: Astro 7 router HMR can crash when files are modified rapidly
# (TypeError: undefined is not a function), plus occasional Windows EINVAL
# on system files. Auto-restart keeps localhost:4321 always available.
# Usage: pwsh -File scripts\dev-guard.ps1

$ErrorActionPreference = "SilentlyContinue"

# Force polling mode (astro.config.mjs also injects it, double safety)
$env:CHOKIDAR_USEPOLLING = "true"
$env:CHOKIDAR_INTERVAL = "300"

$restartCount = 0
$maxRestarts = 200

Write-Host "[dev-guard] starting... Ctrl+C to stop. Auto-restart up to $maxRestarts times" -ForegroundColor Cyan

while ($restartCount -lt $maxRestarts) {
    Write-Host "[dev-guard] starting pnpm dev ($($restartCount + 1)/$maxRestarts)..." -ForegroundColor Green
    # Wait for port release (previous crash may leave TIME_WAIT)
    Start-Sleep -Seconds 2

    pnpm dev 2>&1 | ForEach-Object { Write-Host $_ }
    $code = $LASTEXITCODE

    $restartCount++
    Write-Host "[dev-guard] dev exited (exit=$code), restarting in 5s..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

Write-Host "[dev-guard] restart limit reached. Check manually." -ForegroundColor Red