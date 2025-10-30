#═══════════════════════════════════════════════════════════════════════════════
# 🧪 ORUS BUILDER - TESTE DE ENGINES - RODADA 1
#═══════════════════════════════════════════════════════════════════════════════
# Objetivo: Testar 7 engines (CIG, Template, Groq, Generation, Prompt, Blueprint)
# Data: Saturday, October 11, 2025
# Tempo Estimado: 5 minutos
#═══════════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🧪 ORUS BUILDER - RODADA 1: TESTE DE 7 ENGINES" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"
$testResults = @()

# ═══════════════════════════════════════════════════════════════════════════════
# TEST 1: HEALTH CHECK
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "1️⃣ Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    $enginesActive = ($response.engines.PSObject.Properties | Where-Object { $_.Value -eq $true }).Count
    $enginesTotal = $response.engines.PSObject.Properties.Count
    
    Write-Host "   ✅ Status: $($response.status)" -ForegroundColor Green
    Write-Host "   ✅ Phase: $($response.phase)" -ForegroundColor Green
    Write-Host "   ✅ Engines: $enginesActive/$enginesTotal active" -ForegroundColor Green
    Write-Host "   ✅ Uptime: $([math]::Round($response.uptime, 2))s" -ForegroundColor Green
    
    $testResults += @{
        Test = "Health Check"
        Status = "PASS"
        Details = "$enginesActive/$enginesTotal engines active"
    }
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Test = "Health Check"; Status = "FAIL"; Details = $_.Exception.Message }
}

# ═══════════════════════════════════════════════════════════════════════════════
# TEST 2: DATABASE
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n2️⃣ Testing Database (CRUD)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/test/database" -Method Get
    
    Write-Host "   ✅ Insert: OK (ID: $($response.operations.insert.id))" -ForegroundColor Green
    Write-Host "   ✅ Find: OK" -ForegroundColor Green
    Write-Host "   ✅ Update: OK" -ForegroundColor Green
    Write-Host "   ✅ Count: $($response.operations.count)" -ForegroundColor Green
    
    $testResults += @{ Test = "Database"; Status = "PASS"; Details = "CRUD operations working" }
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Test = "Database"; Status = "FAIL"; Details = $_.Exception.Message }
}

# ═══════════════════════════════════════════════════════════════════════════════
# TEST 3: CIG ENGINE
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n3️⃣ Testing CIG Protocol Engine..." -ForegroundColor Yellow
try {
    $body = @{ code = "export class User { constructor(public name: string) {} }" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/test/cig" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "   ✅ Score: $($response.data.data.score)/100" -ForegroundColor Green
    Write-Host "   ✅ Status: $($response.data.data.status)" -ForegroundColor Green
    Write-Host "   ✅ Type Coverage: $($response.data.data.types.coverage)%" -ForegroundColor Green
    
    $testResults += @{ Test = "CIG Engine"; Status = "PASS"; Details = "Score: $($response.data.data.score)/100" }
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Test = "CIG Engine"; Status = "FAIL"; Details = $_.Exception.Message }
}

# ═══════════════════════════════════════════════════════════════════════════════
# TEST 4: TEMPLATE ENGINE
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n4️⃣ Testing Template Engine..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/test/templates" -Method Get
    
    Write-Host "   ✅ Total Templates: $($response.data.total)" -ForegroundColor Green
    
    $testResults += @{ Test = "Template Engine"; Status = "PASS"; Details = "$($response.data.total) templates" }
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Test = "Template Engine"; Status = "FAIL"; Details = $_.Exception.Message }
}

# ═══════════════════════════════════════════════════════════════════════════════
# TEST 5: GENERATION ENGINE
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n5️⃣ Testing Generation Engine (Groq AI)..." -ForegroundColor Yellow
try {
    $body = @{ 
        prompt = "Create a TypeScript User class with validation"
        language = "typescript"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/test/generate" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "   ✅ Lines Generated: $($response.data.data.totalLines)" -ForegroundColor Green
    Write-Host "   ✅ Quality Score: $($response.data.data.qualityScore)/100" -ForegroundColor Green
    Write-Host "   ✅ CIG Score: $($response.data.data.cigScore)/100" -ForegroundColor Green
    Write-Host "   ✅ Generation Time: $([math]::Round($response.data.data.generationTime / 1000, 2))s" -ForegroundColor Green
    
    $testResults += @{ Test = "Generation Engine"; Status = "PASS"; Details = "$($response.data.data.totalLines) lines, Quality: $($response.data.data.qualityScore)%" }
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Test = "Generation Engine"; Status = "FAIL"; Details = $_.Exception.Message }
}

# ═══════════════════════════════════════════════════════════════════════════════
# TEST 6: PROMPT ENGINE
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n6️⃣ Testing Prompt Engine (NLP Analysis)..." -ForegroundColor Yellow
try {
    $body = @{ prompt = "Create a REST API for user management with authentication" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/test/prompt" -Method Post -Body $body -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "   ✅ Prompt Analysis: SUCCESS" -ForegroundColor Green
        $testResults += @{ Test = "Prompt Engine"; Status = "PASS"; Details = "NLP analysis working" }
    } else {
        Write-Host "   ❌ FAILED: $($response.data.error.message.en)" -ForegroundColor Red
        $testResults += @{ Test = "Prompt Engine"; Status = "FAIL"; Details = $response.data.error.message.en }
    }
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Test = "Prompt Engine"; Status = "FAIL"; Details = $_.Exception.Message }
}

# ═══════════════════════════════════════════════════════════════════════════════
# TEST 7: BLUEPRINT ENGINE
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n7️⃣ Testing Blueprint Engine..." -ForegroundColor Yellow
try {
    $body = @{ 
        content = "# User Management System`n`n## Components`n- User Entity`n- User Repository`n- User Service"
        format = "markdown"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/test/blueprint" -Method Post -Body $body -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "   ✅ Blueprint Processing: SUCCESS" -ForegroundColor Green
        $testResults += @{ Test = "Blueprint Engine"; Status = "PASS"; Details = "Blueprint processing working" }
    } else {
        Write-Host "   ❌ FAILED: $($response.data.error.message.en)" -ForegroundColor Red
        $testResults += @{ Test = "Blueprint Engine"; Status = "FAIL"; Details = $response.data.error.message.en }
    }
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Test = "Blueprint Engine"; Status = "FAIL"; Details = $_.Exception.Message }
}

# ═══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY - RODADA 1" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $testResults.Count

Write-Host "`n✅ PASSED: $passed/$total" -ForegroundColor Green
Write-Host "❌ FAILED: $failed/$total" -ForegroundColor Red
Write-Host ""

foreach ($result in $testResults) {
    $color = if ($result.Status -eq "PASS") { "Green" } else { "Red" }
    $icon = if ($result.Status -eq "PASS") { "✅" } else { "❌" }
    Write-Host "$icon $($result.Test): $($result.Status) - $($result.Details)" -ForegroundColor $color
}

Write-Host "`n═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($passed -eq $total) {
    Write-Host "🎉 ALL TESTS PASSED! Ready for Rodada 2!" -ForegroundColor Green
} elseif ($passed -ge 5) {
    Write-Host "⚠️ PARTIAL SUCCESS! $failed engines need fixing" -ForegroundColor Yellow
} else {
    Write-Host "❌ CRITICAL: Multiple engines failing. Check logs!" -ForegroundColor Red
}

Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
