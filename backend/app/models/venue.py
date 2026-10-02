from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


if TYPE_CHECKING:
    from app.models.event import Event


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    address: Mapped[str] = mapped_column(String(300), nullable=False)

    events: Mapped[list[Event]] = relationship(back_populates="venue")
