# Test Backend API Endpoints
# This script tests all the main API endpoints to verify they're working

Write-Host "=== Testing Gaza Support Backend API ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$success = 0
$failed = 0

# Test 1: API Health Check
Write-Host "[TEST 1] API Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/test" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ PASS: API is running" -ForegroundColor Green
        $success++
    }
} catch {
    Write-Host "✗ FAIL: API is not responding" -ForegroundColor Red
    $failed++
}

# Test 2: Get Donation Categories
Write-Host "[TEST 2] Get Donation Categories..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/donation-categories" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $data = ($response.Content | ConvertFrom-Json)
        Write-Host "✓ PASS: Found $($data.Count) donation categories" -ForegroundColor Green
        $success++
    }
} catch {
    Write-Host "✗ FAIL: Could not get donation categories" -ForegroundColor Red
    $failed++
}

# Test 3: Create Testimonial
Write-Host "[TEST 3] Create Testimonial..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Test User"
        country = "France"
        message = "This is a test testimonial"
        rating = 5
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/testimonials" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    if ($response.StatusCode -eq 201) {
        Write-Host "✓ PASS: Testimonial created successfully" -ForegroundColor Green
        $success++
    }
} catch {
    Write-Host "✗ FAIL: Could not create testimonial - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Test 4: Get Approved Testimonials
Write-Host "[TEST 4] Get Approved Testimonials..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/testimonials" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $data = ($response.Content | ConvertFrom-Json).data
        Write-Host "✓ PASS: Found $($data.Count) approved testimonials" -ForegroundColor Green
        $success++
    }
} catch {
    Write-Host "✗ FAIL: Could not get testimonials" -ForegroundColor Red
    $failed++
}

# Test 5: Get All Donations
Write-Host "[TEST 5] Get All Donations..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/donations" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $data = ($response.Content | ConvertFrom-Json)
        Write-Host "✓ PASS: Found $($data.Count) donations" -ForegroundColor Green
        $success++
    }
} catch {
    Write-Host "✗ FAIL: Could not get donations" -ForegroundColor Red
    $failed++
}

# Test 6: User Registration (Known to fail - needs investigation)
Write-Host "[TEST 6] User Registration..." -ForegroundColor Yellow
try {
    $randomEmail = "test$(Get-Random)@example.com"
    $body = @{
        name = "testuser"
        email = $randomEmail
        password = "Test123!@#"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    if ($response.StatusCode -eq 201) {
        Write-Host "✓ PASS: User registered successfully" -ForegroundColor Green
        $success++
    }
} catch {
    Write-Host "✗ FAIL: User registration failed - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Note: This is a known issue that needs investigation" -ForegroundColor Yellow
    $failed++
}

# Summary
Write-Host ""
Write-Host "=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Passed: $success" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host ""

if ($failed -eq 0) {
    Write-Host "All tests passed! ✓" -ForegroundColor Green
} elseif ($failed -eq 1 -and $success -ge 5) {
    Write-Host "Most tests passed. Only user registration is failing." -ForegroundColor Yellow
} else {
    Write-Host "Some tests failed. Please check the errors above." -ForegroundColor Red
}
