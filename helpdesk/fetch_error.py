import urllib.request, json
try:
    data = json.dumps({"username":"admin","password":"***REMOVED***"}).encode('utf-8')
    req = urllib.request.Request('https://helpdesk-backend-production-edb5.up.railway.app/api/token/', data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)
    print("Success")
except Exception as e:
    body = e.read().decode('utf-8')
    for line in body.split('\n'):
        if 'OperationalError' in line or 'failed:' in line:
            print(line.strip())
