# Adiciona uma issue existente ao GitHub Project (se ainda não estiver no board).
param(
    [Parameter(Mandatory = $true)]
    [int] $Issue
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$config = Get-Content (Join-Path $root "project.json") -Raw | ConvertFrom-Json

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) não encontrado."
    exit 1
}

$owner = $config.owner
$repo = $config.repo
$projectNumber = $config.projectNumber

if (-not $projectNumber) {
    $list = gh project list --owner $owner --format json | ConvertFrom-Json
    $match = $list.projects | Where-Object { $_.title -eq $config.projectTitle } | Select-Object -First 1
    if (-not $match) { throw "Project não encontrado." }
    $projectNumber = $match.number
}

$url = "https://github.com/$owner/$repo/issues/$Issue"
gh project item-add $projectNumber --owner $owner --url $url
Write-Host "Issue #$Issue adicionada ao project $projectNumber."
