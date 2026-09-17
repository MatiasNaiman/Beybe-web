$ErrorActionPreference = 'Stop'
$destination = Join-Path $PSScriptRoot '../public/images/categories'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$sources = Get-Content (Join-Path $PSScriptRoot '../src/data/image-sources.json') -Raw | ConvertFrom-Json
foreach ($source in $sources) {
  Invoke-WebRequest -Uri $source.original -OutFile (Join-Path $destination ($source.slug + '.jpg'))
  Write-Output "$($source.slug): downloaded"
}
