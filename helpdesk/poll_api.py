import urllib.request, json, time, sys, os

admin_password = os.environ.get('ADMIN_PASSWORD', 'admin_pass_placeholder')
data = json.dumps({"username":"admin","password":admin_password}).encode('utf-8')
req = urllib.request.Request('https://helpdesk-backend-production-edb5.up.railway.app/api/token/', data=data, headers={'Content-Type': 'application/json'})

print("Polling endpoint...")
for i in range(12):
    try:
        urllib.request.urlopen(req)
        print("\nSUCCESS! Deployment is live and database is connected.")
        sys.exit(0)
    except Exception as e:
        body = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
        if 'OperationalError' in body:
            print(".", end="", flush=True)
        else:
            print("\nDifferent error:", getattr(e, 'code', 'unknown'), body[:200])
            sys.exit(1)
    time.sleep(5)
print("\nStill failing after 60 seconds.")
sys.exit(1)
