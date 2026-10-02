from datetime import datetime
from typing import Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.venue import VenueRead


class EventBase(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    starts_at: datetime
    category: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=1)
    is_published: bool = False
    venue_id: int = Field(gt=0)

    model_config = ConfigDict(str_strip_whitespace=True)


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    starts_at: datetime | None = None
    category: str | None = Field(default=None, min_length=2, max_length=100)
    description: str | None = Field(default=None, min_length=1)
    is_published: bool | None = None
    venue_id: int | None = Field(default=None, gt=0)

    model_config = ConfigDict(str_strip_whitespace=True)

    @model_validator(mode="after")
    def check_at_least_one_field(self) -> Self:
        if not self.model_fields_set:
            raise ValueError("At least one field must be provided")
        if any(value is None for value in self.model_dump(exclude_unset=True).values()):
            raise ValueError("Fields cannot be null")
        return self


class EventRead(EventBase):
    id: int
    venue: VenueRead

    model_config = ConfigDict(from_attributes=True)
