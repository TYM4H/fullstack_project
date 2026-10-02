from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, selectinload

from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate


def create_event(database: Session, event_data: EventCreate) -> Event:
    event = Event(**event_data.model_dump())
    database.add(event)
    try:
        database.commit()
    except SQLAlchemyError:
        database.rollback()
        raise
    database.refresh(event)
    return get_event(database, event.id) or event


def get_event(database: Session, event_id: int) -> Event | None:
    statement = (
        select(Event)
        .options(selectinload(Event.venue))
        .where(Event.id == event_id)
        .execution_options(populate_existing=True)
    )
    return database.scalar(statement)


def get_events(database: Session, offset: int = 0, limit: int = 100) -> list[Event]:
    statement = (
        select(Event)
        .options(selectinload(Event.venue))
        .order_by(Event.id)
        .offset(offset)
        .limit(limit)
    )
    return list(database.scalars(statement).all())


def update_event(
    database: Session,
    event_id: int,
    event_data: EventUpdate,
) -> Event | None:
    event = database.get(Event, event_id)
    if event is None:
        return None

    for field, value in event_data.model_dump(exclude_unset=True).items():
        setattr(event, field, value)

    try:
        database.commit()
    except SQLAlchemyError:
        database.rollback()
        raise
    return get_event(database, event.id)


def delete_event(database: Session, event_id: int) -> bool:
    event = database.get(Event, event_id)
    if event is None:
        return False

    database.delete(event)
    try:
        database.commit()
    except SQLAlchemyError:
        database.rollback()
        raise
    return True
