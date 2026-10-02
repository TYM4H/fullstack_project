from typing import Self

from pydantic import BaseModel, ConfigDict, Field, model_validator


class VenueBase(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    address: str = Field(min_length=5, max_length=300)

    model_config = ConfigDict(str_strip_whitespace=True)


class VenueCreate(VenueBase):
    pass


class VenueUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    address: str | None = Field(default=None, min_length=5, max_length=300)

    model_config = ConfigDict(str_strip_whitespace=True)

    @model_validator(mode="after")
    def check_at_least_one_field(self) -> Self:
        if not self.model_fields_set:
            raise ValueError("At least one field must be provided")
        if any(value is None for value in self.model_dump(exclude_unset=True).values()):
            raise ValueError("Fields cannot be null")
        return self


class VenueRead(VenueBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
