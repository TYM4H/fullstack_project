from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.venue import Venue
from app.schemas.venue import VenueCreate, VenueUpdate


def create_venue(database: Session, venue_data: VenueCreate) -> Venue:
    venue = Venue(**venue_data.model_dump())
    database.add(venue)
    try:
        database.commit()
    except SQLAlchemyError:
        database.rollback()
        raise
    database.refresh(venue)
    return venue


def get_venue(database: Session, venue_id: int) -> Venue | None:
    return database.get(Venue, venue_id)


def get_venues(database: Session, offset: int = 0, limit: int = 100) -> list[Venue]:
    statement = select(Venue).order_by(Venue.id).offset(offset).limit(limit)
    return list(database.scalars(statement).all())


def update_venue(
    database: Session,
    venue_id: int,
    venue_data: VenueUpdate,
) -> Venue | None:
    venue = get_venue(database, venue_id)
    if venue is None:
        return None

    for field, value in venue_data.model_dump(exclude_unset=True).items():
        setattr(venue, field, value)

    try:
        database.commit()
    except SQLAlchemyError:
        database.rollback()
        raise
    database.refresh(venue)
    return venue


def delete_venue(database: Session, venue_id: int) -> bool:
    venue = get_venue(database, venue_id)
    if venue is None:
        return False

    database.delete(venue)
    try:
        database.commit()
    except SQLAlchemyError:
        database.rollback()
        raise
    return True
