from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.crud import (
    create_event,
    delete_event,
    get_event,
    get_events,
    get_venue,
    update_event,
)
from app.db.database import get_db
from app.schemas.event import EventCreate, EventRead, EventUpdate


router = APIRouter(prefix="/events", tags=["events"])
DatabaseSession = Annotated[Session, Depends(get_db)]


@router.post("", response_model=EventRead, status_code=status.HTTP_201_CREATED)
def add_event(event_data: EventCreate, database: DatabaseSession):
    if get_venue(database, event_data.venue_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found",
        )
    return create_event(database, event_data)


@router.get("", response_model=list[EventRead])
def list_events(
    database: DatabaseSession,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
):
    return get_events(database, offset=offset, limit=limit)


@router.get("/{event_id}", response_model=EventRead)
def read_event(event_id: int, database: DatabaseSession):
    event = get_event(database, event_id)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    return event


@router.patch("/{event_id}", response_model=EventRead)
def edit_event(
    event_id: int,
    event_data: EventUpdate,
    database: DatabaseSession,
):
    if (
        "venue_id" in event_data.model_fields_set
        and get_venue(database, event_data.venue_id) is None
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found",
        )

    event = update_event(database, event_id, event_data)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    return event


@router.delete(
    "/{event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def remove_event(event_id: int, database: DatabaseSession) -> Response:
    if not delete_event(database, event_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
