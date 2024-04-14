from typing import List
from peewee import Model, PostgresqlDatabase, SQL


class DataBaseManager:
    def __init__(self, user, password, host, port, name):
        self.connection = PostgresqlDatabase(name, user=user, password=password, host=host, port=port)
        
    def connect(self):
        self.connection.connect()
        
    def create_database(self, name):
        cursor = self.connection.execute_sql("SELECT 1 FROM pg_database WHERE datname = %s", (f'{name}',))
        exists = cursor.fetchone()
        cursor.close()
        if not exists:
            print('creating new database')
            cursor = self.connection.execute_sql(f"CREATE DATABASE {name}")
            cursor.close()
        else:
            print('database already exists')

    def drop_database(self, name):
        try:
            cursor = self.connection.execute_sql(f"DROP DATABASE IF EXISTS {name}")
            print(f"Database '{name}' dropped successfully.")
            cursor.close()
        except Exception as e:
            print(f"Failed to drop database: {str(e)}")
            
    def create_tables(self, tables:List[Model]):
        for table in tables:
            table._meta.database = self.connection
        
        self.connection.create_tables(tables, safe=True)

