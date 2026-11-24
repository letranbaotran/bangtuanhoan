# Khởi chạy máy chủ HTTP cục bộ cho CHEMVERSE
$port = 8765
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "CHEMVERSE đang chạy tại: http://localhost:$port/" -ForegroundColor Cyan
Write-Host "Nhấn Ctrl+C để dừng máy chủ." -ForegroundColor Gray
Start-Process "http://localhost:$port/"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $rel = $ctx.Request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
    $file = Join-Path $root $rel
    if (Test-Path $file -PathType Leaf) {
      $ext = [IO.Path]::GetExtension($file).ToLower()
      $mime = switch ($ext) {
        '.html' { 'text/html; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.js'   { 'application/javascript; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.svg'  { 'image/svg+xml' }
        default { 'application/octet-stream' }
      }
      $bytes = [IO.File]::ReadAllBytes($file)
      $ctx.Response.ContentType = $mime
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
  }
} finally {
  $listener.Stop()
}
