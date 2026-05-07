Add-Type -AssemblyName System.Drawing

$logoPath = Join-Path $PSScriptRoot "logo2_preta.png"
$fav32Path = Join-Path $PSScriptRoot "favicon-32x32.png"
$fav16Path = Join-Path $PSScriptRoot "favicon-16x16.png"

$src = [System.Drawing.Image]::FromFile($logoPath)
Write-Host "Original: $($src.Width)x$($src.Height)"

# 32x32
$bmp32 = New-Object System.Drawing.Bitmap(32, 32)
$g = [System.Drawing.Graphics]::FromImage($bmp32)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g.DrawImage($src, 0, 0, 32, 32)
$g.Dispose()
$bmp32.Save($fav32Path, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp32.Dispose()

# 16x16
$bmp16 = New-Object System.Drawing.Bitmap(16, 16)
$g2 = [System.Drawing.Graphics]::FromImage($bmp16)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g2.DrawImage($src, 0, 0, 16, 16)
$g2.Dispose()
$bmp16.Save($fav16Path, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp16.Dispose()

$src.Dispose()
Write-Host "Favicons criados: favicon-32x32.png e favicon-16x16.png"
