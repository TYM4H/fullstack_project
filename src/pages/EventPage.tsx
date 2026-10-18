import { Alert, Button, Chip } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEvents } from "../entities/event/model/context";
import { statusLabels } from "../entities/event/model/types";
import { IssueTicketButton } from "../features/issue-ticket/IssueTicketButton";
import { formatEventDate } from "../shared/lib/date";
import { PageContainer } from "../shared/ui/PageContainer";
import { DataState } from "../shared/ui/DataState";

export function EventPage() {
  const { id } = useParams();
  const { events, status, error, reload } = useEvents();
  const event = events.find((item) => item.id === id);
  const formatted = event ? formatEventDate(event.startsAt) : null;
  return (
    <PageContainer>
      <Button component={RouterLink} to="/">
        ← К событиям
      </Button>
      <DataState
        status={status}
        error={error}
        onRetry={() => void reload()}
        empty={!event}
        emptyTitle="Событие не найдено"
        emptyDescription="Проверьте адрес или выберите событие в общей афише."
      >
        {event && formatted && (
          <div className="details-layout">
            <div>
              <div className={`details-poster ${event.posterClass}`}>
                {event.posterUrl && (
                  <img src={event.posterUrl} alt="" className="poster-image" />
                )}
                <span>{event.category}</span>
                <strong>{event.title}</strong>
              </div>
              <section className="about-card">
                <h2>О событии</h2>
                <p>{event.description}</p>
                <p>Время начала указано по Москве (UTC+3).</p>
              </section>
            </div>
            <aside className="details-side">
              <Chip label={event.category} className="category-chip" />
              <h1>{event.title}</h1>
              <p className="detail-line">
                {formatted.date}, {formatted.day.toLowerCase()} ·{" "}
                {formatted.time}
              </p>
              <p className="detail-line">
                {event.place}
                <small>{event.address}</small>
              </p>
              <p>{event.description}</p>
              {event.status === "published" ? (
                <IssueTicketButton eventId={event.id} />
              ) : (
                <Alert
                  severity={event.status === "rejected" ? "error" : "info"}
                >
                  {statusLabels[event.status]}
                  {event.rejectionReason && `: ${event.rejectionReason}`}
                </Alert>
              )}
              <small className="muted">Билет оформляется бесплатно.</small>
            </aside>
          </div>
        )}
      </DataState>
    </PageContainer>
  );
}
