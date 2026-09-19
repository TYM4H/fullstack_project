import { Button, Chip } from "@mui/material";
import { useState } from "react";
import { PageContainer } from "../components/PageContainer";
import { events } from "../data/events";

export function ModerationPage() {
  const [approved, setApproved] = useState<number[]>([]);
  return (
    <PageContainer>
      <div className="page-heading">
        <p className="eyebrow">РАБОЧАЯ ЗОНА</p>
        <h1>События на модерации</h1>
        <p className="lead">
          Проверьте информацию о событиях перед публикацией.
        </p>
      </div>
      <div className="moderation-layout">
        <div>
          <div className="stat-row">
            <div>
              <b>12</b>
              <span>ожидают проверки</span>
            </div>
            <div>
              <b>8</b>
              <span>опубликовано сегодня</span>
            </div>
            <div>
              <b>2</b>
              <span>требуют внимания</span>
            </div>
          </div>
          <div className="moderation-list">
            {events.map((event) => (
              <article key={event.id} className="moderation-item">
                <div className={`mini-poster ${event.posterClass}`}></div>
                <div>
                  <b>{event.title}</b>
                  <p>{event.category}</p>
                </div>
                <div>
                  <b>{event.date}</b>
                  <p>{event.time}</p>
                </div>
                <div>
                  <b>{event.place}</b>
                  <p>{event.address}</p>
                </div>
                <Chip
                  label={
                    approved.includes(event.id)
                      ? "Одобрено"
                      : "Ожидает проверки"
                  }
                  color={approved.includes(event.id) ? "success" : "warning"}
                />
                <Button
                  onClick={() => setApproved((items) => [...items, event.id])}
                  disabled={approved.includes(event.id)}
                  variant="contained"
                >
                  {approved.includes(event.id) ? "Готово" : "Одобрить"}
                </Button>
              </article>
            ))}
          </div>
        </div>
        <aside className="checklist">
          <h2>Что проверить?</h2>
          <p>Убедитесь, что информация полная и достоверная.</p>
          {["Дата и время", "Место проведения", "Описание", "Афиша"].map(
            (item) => (
              <div key={item}>
                <b>{item}</b>
              </div>
            ),
          )}
        </aside>
      </div>
    </PageContainer>
  );
}
