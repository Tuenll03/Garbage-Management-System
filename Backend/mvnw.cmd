<# : batch portion
@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.4
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=
@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile -executionpolicy bypass "& {$scriptDir='%~dp0'; $script='%__MVNW_ARG0_NAME__%'; icm -ScriptBlock ([Scriptblock]::Create((Get-Content -Raw '%~f0'))) -NoNewScope}"`) DO @(
  IF "%%A"=="MVN_CMD" (set __MVNW_CMD__=%%B) ELSE IF "%%B"=="" (echo %%A) ELSE (echo %%A=%%B)
)
@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%
@SET __MVNW_PSMODULEP_SAVE=
@SET __MVNW_ARG0_NAME__=
@IF NOT "%__MVNW_CMD__%"=="" (
  "%__MVNW_CMD__%" %*
  EXIT /B %ERRORLEVEL%
)
@echo Error: Failed to execute Maven via wrapper >&2
@EXIT /B 1

: end batch / begin powershell #>
$scriptDir = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($scriptDir)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$properties = @{}
$propsFile = Join-Path $scriptDir ".mvn/wrapper/maven-wrapper.properties"
if (Test-Path $propsFile) {
    Get-Content $propsFile | Where-Object { $_ -match '^\s*([^#].+?)=(.*)$' } | ForEach-Object {
        $properties[$Matches[1].Trim()] = $Matches[2].Trim()
    }
}

$distributionUrl = $properties["distributionUrl"]
if (-not $distributionUrl) {
    Write-Error "distributionUrl is not defined in $propsFile"
    exit 1
}

$mavenUserHome = if ($env:MAVEN_USER_HOME) { $env:MAVEN_USER_HOME } else { Join-Path $HOME ".m2" }
$wrapperBaseDir = Join-Path $mavenUserHome "wrapper"
$distUrlHash = [System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($distributionUrl))
$distUrlHashString = -join ($distUrlHash | ForEach-Object { $_.ToString("x2") })
$mavenDistDir = Join-Path $wrapperBaseDir "dists"
$targetDistDir = Join-Path $mavenDistDir $distUrlHashString

$mvnCommand = ""
if (Test-Path $targetDistDir) {
    $found = Get-ChildItem -Path $targetDistDir -Filter "mvn.cmd" -Recurse
    if ($found) {
        $mvnCommand = $found[0].FullName
    }
}

if (-not $mvnCommand -or -not (Test-Path $mvnCommand)) {
    Write-Output "Downloading Maven from $distributionUrl ..."

    $zipFile = Join-Path $wrapperBaseDir "$distUrlHashString.zip"
    if (-not (Test-Path $wrapperBaseDir)) {
        New-Item -ItemType Directory -Force -Path $wrapperBaseDir | Out-Null
    }

    $webClient = New-Object System.Net.WebClient
    try {
        $webClient.DownloadFile($distributionUrl, $zipFile)
    } catch {
        Write-Error "Failed to download Maven: $_"
        exit 1
    }

    if (-not (Test-Path $targetDistDir)) {
        New-Item -ItemType Directory -Force -Path $targetDistDir | Out-Null
    }

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $targetDistDir)

    Remove-Item $zipFile -Force

    $found = Get-ChildItem -Path $targetDistDir -Filter "mvn.cmd" -Recurse
    if ($found) {
        $mvnCommand = $found[0].FullName
    }
}

Write-Output "MVN_CMD=$mvnCommand"

