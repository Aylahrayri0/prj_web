<?php
// Simple PHP API for testimonials - No Laravel needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$host = 'localhost';
$dbname = 'gaza_support';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path to get just the API endpoint
$path = preg_replace('#^.*/simple-api\.php#', '', $path);

// Parse path segments
$segments = array_filter(explode('/', $path));
$segments = array_values($segments);

// Debug logging (remove in production)
error_log("API Request: $method $path - Segments: " . json_encode($segments));

// Handle different endpoints
if ($method === 'GET' && empty($segments)) {
    // GET /api/testimonials - Get all approved testimonials
    $stmt = $pdo->prepare("SELECT * FROM testimonials WHERE approved = 1 ORDER BY created_at DESC");
    $stmt->execute();
    $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $result = array_map(function($t) {
        return [
            'id' => $t['id'],
            'name' => $t['name'],
            'country' => $t['country'] ?? $t['email'],
            'message' => $t['content'],
            'rating' => $t['rating'],
            'image_url' => $t['image_url'],
            'approved' => (bool)$t['approved'],
            'created_at' => $t['created_at']
        ];
    }, $testimonials);
    
    echo json_encode(['data' => $result]);
    
} elseif ($method === 'POST' && empty($segments)) {
    // POST /api/testimonials - Create new testimonial
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['name']) || !isset($input['country']) || !isset($input['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO testimonials (name, country, email, content, rating, approved, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())");
    $stmt->execute([
        $input['name'],
        $input['country'],
        $input['country'] . '@example.com',
        $input['message'],
        $input['rating'] ?? 5
    ]);
    
    $id = $pdo->lastInsertId();
    
    http_response_code(201);
    echo json_encode([
        'message' => 'Testimonial submitted successfully and is pending approval',
        'data' => [
            'id' => $id,
            'name' => $input['name'],
            'country' => $input['country'],
            'message' => $input['message'],
            'approved' => false
        ]
    ]);
    
} elseif ($method === 'GET' && $segments[0] === 'admin' && $segments[1] === 'testimonials') {
    // GET /api/admin/testimonials - Get all testimonials (admin)
    if (isset($segments[2]) && $segments[2] === 'pending' && isset($segments[3]) && $segments[3] === 'all') {
        // GET /api/admin/testimonials/pending/all
        $stmt = $pdo->prepare("SELECT * FROM testimonials WHERE approved = 0 ORDER BY created_at ASC");
        $stmt->execute();
        $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['count' => count($testimonials), 'testimonials' => $testimonials]);
    } else {
        // GET /api/admin/testimonials
        $stmt = $pdo->prepare("SELECT * FROM testimonials ORDER BY created_at DESC");
        $stmt->execute();
        $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['data' => $testimonials]);
    }
    
} elseif ($method === 'PUT' && $segments[0] === 'admin' && $segments[1] === 'testimonials' && isset($segments[2])) {
    // PUT /api/admin/testimonials/{id}/approve or reject
    $id = $segments[2];
    $action = $segments[3] ?? null;
    
    if ($action === 'approve') {
        $stmt = $pdo->prepare("UPDATE testimonials SET approved = 1 WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Testimonial approved successfully']);
    } elseif ($action === 'reject') {
        $stmt = $pdo->prepare("UPDATE testimonials SET approved = 0 WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Testimonial rejected successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
    }
    
} elseif ($method === 'DELETE' && $segments[0] === 'admin' && $segments[1] === 'testimonials' && isset($segments[2])) {
    // DELETE /api/admin/testimonials/{id}
    $id = $segments[2];
    $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = ?");
    $stmt->execute([$id]);
    
    http_response_code(204);
    echo json_encode(['message' => 'Testimonial deleted successfully']);
    
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
