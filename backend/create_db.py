import pymysql

# Connect to MySQL server without specifying a database
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='NewPassword123!',
)

try:
    with connection.cursor() as cursor:
        # Create database if it does not exist
        cursor.execute("CREATE DATABASE IF NOT EXISTS smartcart_db;")
        print("Database 'smartcart_db' verified/created.")
finally:
    connection.close()
