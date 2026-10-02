from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.crud import (
    create_venue,
    delete_venue,
    get_venue,
    get_venues,
    update_venue,
)
from app.db.database import get_db
from app.schemas.venue import VenueCreate, VenueRead, VenueUpdate


router = APIRouter(prefix="/venues", tags=["venues"])
DatabaseSession = Annotated[Session, Depends(get_db)]


@router.post("", response_model=VenueRead, status_code=status.HTTP_201_CREATED)
def add_venue(venue_data: VenueCreate, database: DatabaseSession):
    return create_venue(database, venue_data)


@router.get("", response_model=list[VenueRead])
def list_venues(
    database: DatabaseSession,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
):
    return get_venues(database, offset=offset, limit=limit)


@router.get("/{venue_id}", response_model=VenueRead)
def read_venue(venue_id: int, database: DatabaseSession):
    venue = get_venue(database, venue_id)
    if venue is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found",
        )
    return venue


@router.patch("/{venue_id}", response_model=VenueRead)
def edit_venue(
    venue_id: int,
    venue_data: VenueUpdate,
    database: DatabaseSession,
):
    venue = update_venue(database, venue_id, venue_data)
    if venue is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found",
        )
    return venue


@router.delete(
    "/{venue_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def remove_venue(venue_id: int, database: DatabaseSession) -> Response:
    try:
        deleted = delete_venue(database, venue_id)
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete a venue that has events",
        ) from error

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
