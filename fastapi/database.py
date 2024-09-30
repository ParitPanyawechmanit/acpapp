# Import necessary modules from SQLAlchemy and databases
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import MetaData
from databases import Database

# Database connection details
POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"

# Define the async database URL for PostgreSQL
DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

# Create an async engine to connect to the PostgreSQL database using SQLAlchemy
async_engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Metadata and Base model declaration
metadata = MetaData()
Base = declarative_base(metadata=metadata)

# Create an async session factory for handling database transactions using SQLAlchemy
async_session = sessionmaker(
    bind=async_engine,
    expire_on_commit=False,
    class_=AsyncSession
)

# Dependency to get an async database session using SQLAlchemy
async def get_db():
    async with async_session() as session:
        yield session

# Create a Database instance for handling CRUD operations using the databases library
database = Database(DATABASE_URL)

# Connect to the database
async def connect_db():
    await database.connect()
    print("Database connected")

# Disconnect from the database
async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")

# CRUD Operations using databases library

# Function to insert a new user into the users table
async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO users (username, password_hash, email)
    VALUES (:username, :password_hash, :email)
    RETURNING user_id, username, password_hash, email, created_at
    """
    values = {"username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# Function to select a user by user_id from the users table
async def get_user(username: str):
    query = """
    SELECT user_id, username, email, password_hash, created_at
    FROM users
    WHERE username = :username
    """
    return await database.fetch_one(query=query, values={"username": username})

# Function to select a user by email from the users table
async def get_user_by_email(email: str, password_hash: str):
    query = """
    SELECT user_id, username, email, password_hash, created_at
    FROM users
    WHERE email = :email
    """
    user = await database.fetch_one(query=query, values={"email": email})
    # Optional: Validate the password here if needed
    if user and user["password_hash"] == password_hash:
        return user
    return None

# Function to update a user in the users table
async def update_user(user_id: int, username: str, password_hash: str, email: str):
    query = """
    UPDATE users
    SET username = :username, password_hash = :password_hash, email = :email
    WHERE user_id = :user_id
    RETURNING user_id, username, password_hash, email, created_at
    """
    values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# Function to delete a user from the users table
async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})
