param(
  [string]$ProjectId = "",
  [string]$ServiceName = "manwah-demo",
  [string]$Region = "asia-east1",
  [string]$GeminiApiKey = "",
  [switch]$SkipLint,
  [switch]$SkipApiEnable
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Require-Command {
  param([string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $Name. Please install it first."
  }
}

function Prompt-Value {
  param(
    [string]$CurrentValue,
    [string]$Label,
    [bool]$AllowEmpty = $false
  )

  if ($CurrentValue) {
    return $CurrentValue
  }

  while ($true) {
    $inputValue = Read-Host $Label
    if ($AllowEmpty -or -not [string]::IsNullOrWhiteSpace($inputValue)) {
      return $inputValue.Trim()
    }
  }
}

function Run-Step {
  param(
    [string]$Title,
    [scriptblock]$Action
  )

  Write-Host ""
  Write-Host "==> $Title" -ForegroundColor Cyan
  & $Action
}

Require-Command "gcloud"
Require-Command "npm"

$ProjectId = Prompt-Value -CurrentValue $ProjectId -Label "Google Cloud Project ID"
$ServiceName = Prompt-Value -CurrentValue $ServiceName -Label "Cloud Run service name"
$Region = Prompt-Value -CurrentValue $Region -Label "Cloud Run region"
$GeminiApiKey = Prompt-Value -CurrentValue $GeminiApiKey -Label "GEMINI_API_KEY (leave blank to deploy without AI features)" -AllowEmpty $true

Push-Location $repoRoot

try {
  Run-Step "Checking Google Cloud login" {
    $activeAccount = (gcloud auth list --filter=status:ACTIVE --format="value(account)")
    if (-not $activeAccount) {
      Write-Host "No active gcloud login found. Opening login flow..." -ForegroundColor Yellow
      gcloud auth login
    } else {
      Write-Host "Active account: $activeAccount"
    }
  }

  Run-Step "Setting active project" {
    gcloud config set project $ProjectId | Out-Host
  }

  if (-not $SkipApiEnable) {
    Run-Step "Enabling required Google Cloud services" {
      gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com | Out-Host
    }
  }

  Run-Step "Installing dependencies" {
    npm install | Out-Host
  }

  if (-not $SkipLint) {
    Run-Step "Running TypeScript check" {
      npm run lint | Out-Host
    }
  }

  Run-Step "Deploying to Cloud Run" {
    $deployArgs = @(
      "run", "deploy", $ServiceName,
      "--source", ".",
      "--region", $Region,
      "--allow-unauthenticated",
      "--max-instances", "1",
      "--set-env-vars", "NODE_ENV=production"
    )

    if (-not [string]::IsNullOrWhiteSpace($GeminiApiKey)) {
      $deployArgs[-1] = "NODE_ENV=production,GEMINI_API_KEY=$GeminiApiKey"
    }

    gcloud @deployArgs | Out-Host
  }

  Run-Step "Fetching deployed service URL" {
    $serviceUrl = gcloud run services describe $ServiceName --region $Region --format="value(status.url)"
    if ($serviceUrl) {
      Write-Host ""
      Write-Host "Deployment complete." -ForegroundColor Green
      Write-Host "Public URL: $serviceUrl" -ForegroundColor Green
    } else {
      Write-Host "Deployment finished, but service URL was not returned. Please check Cloud Run console." -ForegroundColor Yellow
    }
  }
}
finally {
  Pop-Location
}
