# Test Backend API Endpoints
Write-Host "Testing Gaza Support Backend APIs" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Test 1: API Test Endpoint
Write-Host "[1/4] Testing /api/test..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/test" -Method GET -TimeoutSec 10
    Write-Host "✓ Success: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Donations Endpoint
Write-Host "[2/4] Testing /api/donations..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/donations" -Method GET -TimeoutSec 10
    $count = if ($response -is [Array]) { $response.Count } else { 1 }
    Write-Host "✓ Success: Found $count donation(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Testimonials Endpoint
Write-Host "[3/4] Testing /api/testimonials..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/testimonials" -Method GET -TimeoutSec 10
    $count = if ($response.data) { $response.data.Count } else { 0 }
    Write-Host "✓ Success: Found $count approved testimonial(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Create New Testimonial
Write-Host "[4/4] Testing POST /api/testimonials (submit new message)..." -ForegroundColor Cyan
try {
    $body = @{
        name = "Test User"
        country = "Morocco"
        message = "This is a test message from the verification script"
        rating = 5
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/testimonials" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "✓ Success: Testimonial submitted (ID: $($response.data.id))" -ForegroundColor Green
    Write-Host "  Message: $($response.message)" -ForegroundColor Yellow
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=================================" -ForegroundColor Green
Write-Host "Backend API tests complete!" -ForegroundColor Green
