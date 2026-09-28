# Move um card do GitHub Project pelo número da issue.
# Requer: GitHub CLI (gh) autenticado — gh auth login
param(
    [Parameter(Mandatory = $true)]
    [int] $Issue,

    [Parameter(Mandatory = $true)]
    [ValidateSet("todo", "in_progress", "in_review", "done")]
    [string] $Status
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$configPath = Join-Path $root "project.json"
$config = Get-Content $configPath -Raw | ConvertFrom-Json

$owner = $config.owner
$projectNumber = $config.projectNumber
$statusFieldName = $config.statusFieldName
$statusLabel = $config.statusOptions.$Status

if (-not $statusLabel) {
    throw "Status '$Status' não mapeado em project.json statusOptions."
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) não encontrado. Instale: https://cli.github.com/ — ou mova a issue #$Issue manualmente no board."
    exit 1
}

if (-not $projectNumber) {
    $list = gh project list --owner $owner --format json | ConvertFrom-Json
    $match = $list.projects | Where-Object { $_.title -eq $config.projectTitle } | Select-Object -First 1
    if (-not $match) {
        throw "Project '$($config.projectTitle)' não encontrado. Defina projectNumber em project.json."
    }
    $projectNumber = $match.number
    Write-Host "Usando project number $projectNumber (auto-detectado)."
}

$projectId = (gh project view $projectNumber --owner $owner --format json | ConvertFrom-Json).id
$fieldsJson = gh project field-list $projectNumber --owner $owner --format json | ConvertFrom-Json
$statusField = $fieldsJson.fields | Where-Object { $_.name -eq $statusFieldName } | Select-Object -First 1
if (-not $statusField) {
    throw "Campo '$statusFieldName' não encontrado no project."
}

$option = $statusField.options | Where-Object { $_.name -eq $statusLabel } | Select-Object -First 1
if (-not $option) {
    throw "Opção '$statusLabel' não encontrada no campo Status. Opções: $($statusField.options.name -join ', ')"
}

$itemsJson = gh project item-list $projectNumber --owner $owner --format json --limit 500 | ConvertFrom-Json
$item = $itemsJson.items | Where-Object { $_.content.number -eq $Issue } | Select-Object -First 1
if (-not $item) {
    throw "Issue #$Issue não está no project. Adicione com add-task-to-project.ps1 ou pela UI."
}

gh project item-edit `
    --project-id $projectId `
    --id $item.id `
    --field-id $statusField.id `
    --single-select-option-id $option.id

Write-Host "Issue #$Issue → '$statusLabel' no project $projectNumber."
