# Set variables
$projectName = "annex-crf"
$githubUser = "DariaRodovnichenko"
$githubRepo = "crf-annex"
$deployPath = "dist/$projectName/browser"

# Clean dist if it exists
if (Test-Path "dist") {
  Remove-Item -Recurse -Force dist
  Write-Host "🧹 Cleaned dist folder"
} else {
  Write-Host "⚠️ No dist folder to clean"
}

# Build app
Write-Host "🔨 Building app for production..."
Start-Process -Wait -NoNewWindow -FilePath "npx" -ArgumentList "ng", "build", $projectName, "--configuration=production", "--base-href=https://$githubUser.github.io/$githubRepo/"

# Deploy to GitHub Pages
Write-Host "🚀 Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir="$deployPath"

# Firebase Hosting deploy
Write-Host "🔥 Deploying to Firebase..."
firebase deploy

Write-Host "✅ Deployment complete!"
