import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Event } from "../model/types";
import { formatEventDate } from "../../../shared/lib/date";

type EventCardProps = { event: Event };

export function EventCard({ event }: EventCardProps) {
  const { date, day } = formatEventDate(event.startsAt);
  return (
    <article className="event-card">
      <div className={`event-poster ${event.posterClass}`}>
        {event.posterUrl && (
          <img src={event.posterUrl} alt="" className="poster-image" />
        )}
        <span>{event.category}</span>
        <strong>{event.title}</strong>
      </div>
      <div className="event-card-body">
        <div className="date-badge">
          <b>{date.split(" ")[0]}</b>
          <span>{date.split(" ")[1]?.toUpperCase()}</span>
          <small>{day}</small>
        </div>
        <div className="event-card-info">
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p className="event-place">{event.place}</p>
        </div>
      </div>
      <Button
        component={RouterLink}
        to={`/events/${event.id}`}
        variant="contained"
        fullWidth
      >
        Подробнее
      </Button>
    </article>
  );
}
