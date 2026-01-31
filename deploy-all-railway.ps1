# Script d'automatisation du déploiement Railway pour CHIFT
$services = @(
    "backend-user-service",
    "backend-caisse-service",
    "backend-comptes-service",
    "backend-mail-service",
    "backend",
    "backend-gateway"
)

$rootPath = Get-Location

foreach ($service in $services) {
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    Write-Host "Déploiement du service : $service" -ForegroundColor Green
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    
    $servicePath = Join-Path $rootPath $service
    if (Test-Path $servicePath) {
        Set-Location $servicePath
        
        # S'assurer que railway.json existe pour forcer Docker
        if (-not (Test-Path "railway.json")) {
            Write-Host "Création de railway.json..."
            $railwayJson = '{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "strategy": "DOCKER"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}'
            $railwayJson | Out-File -FilePath "railway.json" -Encoding utf8
        }

        # Déployer
        Write-Host "Lancement de railway up..."
        railway up --detach
    } else {
        Write-Warning "Le dossier $servicePath n'existe pas."
    }
}

Set-Location $rootPath
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "Tous les services ont été envoyés à Railway !" -ForegroundColor Green
Write-Host "Vérifiez l'avancement sur le tableau de bord Railway." -ForegroundColor Yellow
