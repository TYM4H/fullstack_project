from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


if TYPE_CHECKING:
    from app.models.venue import Venue


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    starts_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    venue_id: Mapped[int] = mapped_column(
        ForeignKey("venues.id"),
        nullable=False,
        index=True,
    )

    venue: Mapped[Venue] = relationship(back_populates="events")
