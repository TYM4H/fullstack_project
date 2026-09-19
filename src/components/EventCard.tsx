import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Event } from "../types/event";

type EventCardProps = { event: Event };

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="event-card">
      <div className={`event-poster ${event.posterClass}`}>
        <span>{event.category}</span>
        <strong>{event.title}</strong>
      </div>
      <div className="event-card-body">
        <div className="date-badge">
          <b>{event.date.split(" ")[0]}</b>
          <span>{event.date.split(" ")[1]?.toUpperCase()}</span>
          <small>{event.day}</small>
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
