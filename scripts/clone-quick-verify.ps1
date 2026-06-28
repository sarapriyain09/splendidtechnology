$ErrorActionPreference = 'Stop'

$links = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links'
if ($env:Path -notlike "*$links*") {
  $env:Path = "$links;$env:Path"
}

$base = 'http://localhost:3000'
$tmp = Join-Path $env:TEMP ('clone-quick-' + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tmp | Out-Null

$png = [Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9sM7t4sAAAAASUVORK5CYII=')
1..20 | ForEach-Object { [IO.File]::WriteAllBytes((Join-Path $tmp ("p$_.png")), $png) }

$videoFile = Join-Path $tmp 'train.mp4'
$voiceFile = Join-Path $tmp 'voice.mp3'
ffmpeg -hide_banner -loglevel error -y -f lavfi -i color=c=black:s=1280x720:d=8 -pix_fmt yuv420p $videoFile | Out-Null
ffmpeg -hide_banner -loglevel error -y -f lavfi -i anullsrc=r=44100:cl=stereo -t 305 -q:a 9 -acodec libmp3lame $voiceFile | Out-Null

$photoArgs = @('-sS', '-X', 'POST', ($base + '/api/media/clone/photos'), '-F', 'cloneName=Quick Verify', '-F', 'language=english')
Get-ChildItem $tmp -Filter 'p*.png' | ForEach-Object {
  $photoArgs += '-F'
  $photoArgs += ('files=@' + $_.FullName + ';type=image/png')
}

$photos = (& curl.exe @photoArgs | ConvertFrom-Json)
$cloneId = $photos.clone.id
$video = (& curl.exe -sS -X POST ($base + '/api/media/clone/video') -F ('cloneId=' + $cloneId) -F ('file=@' + $videoFile + ';type=video/mp4') | ConvertFrom-Json)
$voice = (& curl.exe -sS -X POST ($base + '/api/media/clone/voice') -F 'name=Quick Voice' -F 'language=english' -F ('file=@' + $voiceFile + ';type=audio/mpeg') | ConvertFrom-Json)
$voiceCloneId = $voice.voiceClone.id

$trainBody = @{
  avatarCloneId = $cloneId
  voiceCloneId = $voiceCloneId
  cloneName = 'Quick Verify'
  language = 'english'
  accent = 'neutral'
  speakingSpeed = 1.0
  gender = 'other'
  defaultBackground = 'office'
  avatarCategory = 'business'
} | ConvertTo-Json

$train = Invoke-RestMethod -Method Post -Uri ($base + '/api/media/clone/train') -ContentType 'application/json' -Body $trainBody

$genBody = @{
  avatarCloneId = $cloneId
  voiceCloneId = $voiceCloneId
  script = 'Quick final verification.'
  emotion = 'professional'
  background = 'office'
  music = 'none'
  subtitle = $true
  aspectRatio = '16:9'
} | ConvertTo-Json

try {
  $resp = Invoke-WebRequest -Method Post -Uri ($base + '/api/media/clone/generate') -ContentType 'application/json' -Body $genBody -UseBasicParsing
  $code = [int]$resp.StatusCode
  $body = $resp.Content
} catch {
  if ($_.Exception.Response) {
    $code = [int]$_.Exception.Response.StatusCode
    $reader = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    $reader.Close()
  } else {
    $code = -1
    $body = $_.Exception.Message
  }
}

[PSCustomObject]@{
  cloneId = $cloneId
  voiceCloneId = $voiceCloneId
  videoError = $video.error
  voiceError = $voice.error
  trainAvatarStatus = $train.avatarClone.status
  trainVoiceStatus = $train.voiceClone.status
  generateStatusCode = $code
  generateBody = $body
} | ConvertTo-Json -Depth 8
