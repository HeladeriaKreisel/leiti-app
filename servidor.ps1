# Servidor HTTP Local en PowerShell para el proyecto Leiti.app (Sin caché para reflejar cambios al instante)
param([int]$Port = 3000)

$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " [OK] Servidor Leiti.app iniciado con exito" -ForegroundColor Cyan
    Write-Host " Accede desde tu navegador a: $prefix" -ForegroundColor Yellow
    Write-Host " Conectado en vivo con Supabase: cthvxtjwstyezwzuohdx" -ForegroundColor Green
    Write-Host " Presiona Ctrl + C en esta ventana para detener el servidor" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Green
    
    Start-Process "http://localhost:$Port/app.html"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Evitar caché del navegador para que siempre cargue la última versión conectada a Supabase
        $response.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        $response.Headers.Add("Pragma", "no-cache")
        $response.Headers.Add("Expires", "0")

        $path = $request.Url.LocalPath
        if ($path -eq "/" -or $path -eq "") {
            $path = "/app.html"
        }

        $localPath = Join-Path $root ($path.TrimStart('/').Replace('/', '\'))

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".jsx"  { "text/plain; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Archivo no encontrado")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
