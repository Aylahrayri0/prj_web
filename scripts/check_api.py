import subprocess
import time
import json
import urllib.request
import urllib.error

backend_dir = r"C:\Users\hh\Documents\GitHub\prj_web\gaza-support-backend"
process = subprocess.Popen(
    ["php", "artisan", "serve", "--host=127.0.0.1", "--port=8000"],
    cwd=backend_dir,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

print("Starting Laravel server...")
time.sleep(3)

endpoints = [
    "/api/test",
    "/api/donations",
    "/api/testimonials",
    "/api/admin/testimonials/pending/all",
]

for endpoint in endpoints:
    url = f"http://127.0.0.1:8000{endpoint}"
    print(f"=== GET {endpoint} ===")
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            body = response.read().decode("utf-8")
            try:
                parsed = json.loads(body)
            except json.JSONDecodeError:
                parsed = body
        print(json.dumps(parsed, ensure_ascii=False, indent=2))
    except urllib.error.HTTPError as http_err:
        error_body = http_err.read().decode("utf-8")
        print(f"HTTPError {http_err.code} {http_err.reason}: {error_body}")
    except Exception as err:
        print(f"Request failed: {err}")

print("Stopping Laravel server...")
process.terminate()
try:
    process.wait(timeout=5)
except subprocess.TimeoutExpired:
    process.kill()
print("Server stopped.")
