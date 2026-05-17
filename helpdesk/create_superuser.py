"""Create superuser on Railway production database."""
import psycopg2
from django.contrib.auth.hashers import make_password
import os, sys, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helpdesk.settings')

# Connect to Railway's PUBLIC database URL
DB_URL = os.environ.get('DATABASE_URL')
if not DB_URL:
    print("ERROR: DATABASE_URL environment variable is required.")
    sys.exit(1)

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
admin_password = os.environ.get('ADMIN_PASSWORD', 'admin_pass_placeholder')
hashed = make_password(admin_password)

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
student_password = os.environ.get('STUDENT_PASSWORD', 'student_pass_placeholder')
hashed_student = make_password(student_password)
cur.execute("""
    INSERT INTO auth_user (username, email, password, is_staff, is_superuser, is_active, first_name, last_name, date_joined)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
    ON CONFLICT (username) DO NOTHING
""", ('student1', 'student1@campus.edu', hashed_student, False, False, True, 'Student', 'One'))

print("Student user created: student1")

conn.close()
print("\nDone! Login credentials:")
print(f"  Admin:   username=admin, password={admin_password}")
print(f"  Student: username=student1, password={student_password}")
