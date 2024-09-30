from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import *  # Ensure your database functions are imported

router = APIRouter()

# Pydantic models for user creation and response
class UserCreate(BaseModel):
    username: str
    password_hash: str
    email: str

class UserUpdate(BaseModel):
    username: Optional[str]
    password_hash: Optional[str]
    email: Optional[str]

class User(BaseModel):
    user_id: int
    username: str
    email: str
    created_at: datetime

# Updated login model to support both username and email
class UserLogin(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password_hash: str

# Endpoint to create a new user
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
    # Check if the username or email already exists
    existing_user = await get_user(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    existing_user_by_email = await get_user_by_email(user.email, user.password_hash)
    if existing_user_by_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Create new user
    result = await insert_user(user.username, user.password_hash, user.email)
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating user")
    return result

# Endpoint to get a user by user_id
@router.get("/users/{user_id}", response_model=User)
async def read_user(user_id: int):
    result = await get_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to update a user
@router.put("/users/{user_id}", response_model=User)
async def update_user_endpoint(user_id: int, user: UserUpdate):
    result = await update_user(user_id, user.username, user.password_hash, user.email)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to delete a user
@router.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int):
    result = await delete_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

# Endpoint for user login using either email or username
@router.post("/users/login", response_model=User)
async def login_user(user: UserLogin):
    # Ensure that either email or username is provided
    if not user.email and not user.username:
        raise HTTPException(status_code=400, detail="Must provide either email or username for login")

    # Fetch user based on either email or username
    if user.email:
        db_user = await get_user_by_email(user.email, user.password_hash)
    else:
        db_user = await get_user(user.username)

    # If no user is found or the password does not match, raise an error
    if db_user is None or db_user["password_hash"] != user.password_hash:
        raise HTTPException(status_code=404, detail="Invalid username or password")

    # If login is successful, return user info (omit password hash)
    return {
        "user_id": db_user["user_id"],
        "username": db_user["username"],
        "email": db_user["email"],
        "created_at": db_user["created_at"]
    }
