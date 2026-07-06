from pydantic import BaseModel, Field


class AccountCreate(BaseModel):
    code: str = Field(min_length=2, max_length=20)
    name: str = Field(min_length=2, max_length=255)
    category: str = Field(min_length=2, max_length=50)
    subtype: str = Field(default="", max_length=80)
    vat_rate: str = Field(default="20%", max_length=20)


class AccountUpdate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    category: str = Field(min_length=2, max_length=50)
    subtype: str = Field(default="", max_length=80)
    vat_rate: str = Field(default="20%", max_length=20)
    is_active: bool = True


class AccountData(BaseModel):
    id: str
    code: str
    name: str
    category: str
    subtype: str
    vat_rate: str
    is_active: bool
    is_system: bool
