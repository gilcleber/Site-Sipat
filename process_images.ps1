Add-Type -AssemblyName System.Drawing

$inputFolder = "C:\Users\Gil Cleber\.gemini\antigravity\brain\c3b5bd39-2349-4edb-84ac-b62b1469ee7d\.user_uploaded"
$outputFolder = "E:\ANTIGRAVITY LINKS\SITE SIPAT\public\fotos"

if (!(Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder -Force
}

$photos = @(
    @{ Name = "dia2_capa.jpg"; File = "media_1792528110867_6ece586c.jpg"; CropTop = 0.08; CropBottom = 0.0 },
    @{ Name = "foto_01.jpg"; File = "media_1792527797499_f3d31845.jpg"; CropTop = 0.05; CropBottom = 0.0 },
    @{ Name = "foto_02.jpg"; File = "media_1792527797501_2ae97eee.jpg"; CropTop = 0.38; CropBottom = 0.0 },
    @{ Name = "foto_03.jpg"; File = "media_1792527797503_cb8cb2c1.jpg"; CropTop = 0.38; CropBottom = 0.0 },
    @{ Name = "foto_04.jpg"; File = "media_1792527797508_ae223fe2.jpg"; CropTop = 0.05; CropBottom = 0.0 },
    @{ Name = "foto_05.jpg"; File = "media_1792527797510_8d7f74dc.jpg"; CropTop = 0.40; CropBottom = 0.0 },
    @{ Name = "foto_06.jpg"; File = "media_1792527875294_a890d70b.jpg"; CropTop = 0.42; CropBottom = 0.0 },
    @{ Name = "foto_07.jpg"; File = "media_1792527875297_30a430f0.jpg"; CropTop = 0.42; CropBottom = 0.0 }
)

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)

foreach ($p in $photos) {
    $srcPath = Join-Path $inputFolder $p.File
    $destPath = Join-Path $outputFolder $p.Name
    
    if (Test-Path $srcPath) {
        $img = [System.Drawing.Bitmap]::FromFile($srcPath)
        
        $topCut = [int]($img.Height * $p.CropTop)
        $bottomCut = [int]($img.Height * $p.CropBottom)
        $newHeight = $img.Height - $topCut - $bottomCut
        $newWidth = $img.Width
        
        $cropRect = New-Object System.Drawing.Rectangle(0, $topCut, $newWidth, $newHeight)
        $targetBmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        
        $g = [System.Drawing.Graphics]::FromImage($targetBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $newWidth, $newHeight)
        $g.DrawImage($img, $destRect, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        $img.Dispose()
        
        $targetBmp.Save($destPath, $encoder, $encoderParams)
        $targetBmp.Dispose()
        
        Write-Output "Saved: $($p.Name) ($newWidth x $newHeight)"
    } else {
        Write-Output "File not found: $srcPath"
    }
}
