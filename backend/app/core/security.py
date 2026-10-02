import hashlib
import os
from datetime import datetime, timedelta
import jwt
from backend.app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

def hash_password(password: str) -> str:
    """
    Secure PBKDF2-HMAC password hashing with random salt fallback.
    """
    salt = os.urandom(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return f"{salt.hex()}:{pwd_hash.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if ":" not in hashed_password:
            return False
        salt_hex, pwd_hash_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        pwd_hash = bytes.fromhex(pwd_hash_hex)
        check_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        return check_hash == pwd_hash
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
