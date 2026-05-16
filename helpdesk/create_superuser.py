"""Create superuser on Railway production database."""
import psycopg2
from django.contrib.auth.hashers import make_password
import os, sys, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helpdesk.settings')

# Connect to Railway's PUBLIC database URL
DB_URL = 'postgresql://postgres:***REMOVED***@yamanote.proxy.rlwy.net:14070/railway'

from urllib.parse import urlparse
p = urlparse(DB_URL)

conn = psycopg2.connect(
    dbname=p.path[1:],
    user=p.username,
    password=p.password,
    host=p.hostname,
    port=p.port,
    sslmode='require'
)
conn.autocommit = True
cur = conn.cursor()

# Check existing tables
cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public'")
tables = [t[0] for t in cur.fetchall()]
print(f"Tables found: {tables}")

if 'auth_user' not in tables:
    print("ERROR: auth_user table not found. Migrations haven't run yet.")
    print("Redeploy on Railway first, then run this again.")
    conn.close()
    sys.exit(1)

# Hash the password using Django's hasher
django.setup()
hashed = make_password('***REMOVED***')

# Create superuser
cur.execute("""
    INSERT INTO auth_user (username, email, password, is_staff, is_superuser, is_active, first_name, last_name, date_joined)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
    ON CONFLICT (username) DO UPDATE SET is_staff=true, is_superuser=true, password=%s
    RETURNING id, username, is_staff, is_superuser
""", ('admin', 'admin@campus.edu', hashed, True, True, True, 'Admin', 'User', hashed))

row = cur.fetchone()
print(f"Superuser ready: id={row[0]}, username={row[1]}, is_staff={row[2]}, is_superuser={row[3]}")

# Also create a student user
hashed_student = make_password('***REMOVED***')
cur.execute("""
    INSERT INTO auth_user (username, email, password, is_staff, is_superuser, is_active, first_name, last_name, date_joined)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
    ON CONFLICT (username) DO NOTHING
""", ('student1', 'student1@campus.edu', hashed_student, False, False, True, 'Student', 'One'))

print("Student user created: student1")

conn.close()
print("\nDone! Login credentials:")
print("  Admin:   username=admin, password=***REMOVED***")
print("  Student: username=student1, password=***REMOVED***")
