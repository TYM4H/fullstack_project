import { Button, Chip } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { events } from "../data/events";

export function EventPage() {
  const { id } = useParams();
  const event = events.find((item) => item.id === Number(id));
  if (!event)
    return (
      <PageContainer>
        <h1>Событие не найдено</h1>
      </PageContainer>
    );
  return (
    <PageContainer>
      <div className="details-layout">
        <div>
          <div className={`details-poster ${event.posterClass}`}>
            <span>{event.category}</span>
            <strong>{event.title}</strong>
          </div>
          <section className="about-card">
            <h2>О событии</h2>
            <p>
              {event.description} Вас ждёт атмосферный вечер и новые
              впечатления.
            </p>
            <div className="feature-row">
              <span>Живой звук</span>
              <span>Дружеская атмосфера</span>
              <span>Любимые хиты</span>
            </div>
          </section>
        </div>
        <aside className="details-side">
          <Chip label={event.category} className="category-chip" />
          <h1>{event.title}</h1>
          <p className="detail-line">
            {event.date}, {event.day.toLowerCase()} · {event.time}
          </p>
          <p className="detail-line">
            {event.place}
            <small>{event.address}</small>
          </p>
          <p>{event.description}</p>
          <Button
            component={RouterLink}
            to="/ticket"
            variant="contained"
            fullWidth
          >
            Получить билет
          </Button>
          <small className="muted">
            Билеты предоставляются организатором. Количество мест ограничено.
          </small>
        </aside>
      </div>
    </PageContainer>
  );
}
