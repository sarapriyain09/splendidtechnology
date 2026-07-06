from pydantic import BaseModel, EmailStr, Field


class RegisterCompanyRequest(BaseModel):
    company_name: str = Field(min_length=2, max_length=255)
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenData(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserData(BaseModel):
    id: str
    company_id: str
    full_name: str
    email: EmailStr
    role: str
