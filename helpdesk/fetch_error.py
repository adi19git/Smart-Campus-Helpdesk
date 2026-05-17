import urllib.request, json, os
try:
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin_pass_placeholder')
    data = json.dumps({"username":"admin","password":admin_password}).encode('utf-8')
    req = urllib.request.Request('https://helpdesk-backend-production-edb5.up.railway.app/api/token/', data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)
    print("Success")
except Exception as e:
    body = e.read().decode('utf-8')
    for line in body.split('\n'):
        if 'OperationalError' in line or 'failed:' in line:
            print(line.strip())
