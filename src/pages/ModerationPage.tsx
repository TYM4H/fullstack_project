import { Alert, Button, Chip, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useEvents } from "../entities/event/model/context";
import { statusLabels, type EventStatus } from "../entities/event/model/types";
import { ModerationActions } from "../features/moderate-event/ModerationActions";
import { formatEventDate } from "../shared/lib/date";
import { PageContainer } from "../shared/ui/PageContainer";
import { DataState } from "../shared/ui/DataState";
import { DemoControls } from "../shared/ui/DemoControls";

export function ModerationPage() {
  const { events, status, error, reload } = useEvents();
  const [tab, setTab] = useState<EventStatus>("pending");
  const [message, setMessage] = useState("");
  const filtered = events.filter((event) => event.status === tab);
  return (
    <PageContainer>
      <div className="page-heading">
        <p className="eyebrow">РАБОЧАЯ ЗОНА</p>
        <h1>Модерация событий</h1>
        <p className="lead">
          Проверьте информацию перед публикацией. В учебном режиме роли доступны
          без авторизации.
        </p>
      </div>
      {message && (
        <Alert severity="success" onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      <DataState status={status} error={error} onRetry={() => void reload()}>
        <div className="stat-row">
          {(["pending", "published", "rejected"] as const).map((item) => (
            <div key={item}>
              <b>{events.filter((event) => event.status === item).length}</b>
              <span>{statusLabels[item]}</span>
            </div>
          ))}
        </div>
        <Tabs
          value={tab}
          onChange={(_, value: EventStatus) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Статус модерации"
        >
          {(["pending", "published", "rejected"] as const).map((item) => (
            <Tab key={item} value={item} label={statusLabels[item]} />
          ))}
        </Tabs>
        <div className="moderation-layout">
          <DataState
            status="success"
            error=""
            onRetry={() => void reload()}
            empty={filtered.length === 0}
            emptyTitle="В этом разделе нет событий"
            emptyDescription="Создайте новое событие или выберите другой статус."
          >
            <div className="moderation-list">
              {filtered.map((event) => {
                const formatted = formatEventDate(event.startsAt);
                return (
                  <article key={event.id} className="moderation-item">
                    <div className={`mini-poster ${event.posterClass}`}>
                      {event.posterUrl && <img src={event.posterUrl} alt="" />}
                    </div>
                    <div className="moderation-info">
                      <h2>{event.title}</h2>
                      <p>
                        {event.category} · {formatted.date} · {formatted.time}{" "}
                        МСК
                      </p>
                      <p>
                        {event.place} · {event.address}
                      </p>
                      <p>{event.description}</p>
                      {event.rejectionReason && (
                        <p className="rejection-reason">
                          Причина: {event.rejectionReason}
                        </p>
                      )}
                      <Button component={RouterLink} to={`/events/${event.id}`}>
                        Посмотреть событие
                      </Button>
                    </div>
                    {event.status === "pending" ? (
                      <ModerationActions
                        eventId={event.id}
                        title={event.title}
                        onSuccess={setMessage}
                      />
                    ) : (
                      <Chip
                        label={statusLabels[event.status]}
                        color={
                          event.status === "published" ? "success" : "error"
                        }
                      />
                    )}
                  </article>
                );
              })}
            </div>
          </DataState>
          <aside className="checklist">
            <h2>Что проверить?</h2>
            <p>
              Откройте событие и проверьте данные. Если нужна правка, укажите
              причину отклонения.
            </p>
            {[
              "Название и описание",
              "Дата и время",
              "Место и адрес",
              "Афиша, если добавлена",
            ].map((item) => (
              <div key={item}>
                <b>{item}</b>
              </div>
            ))}
          </aside>
        </div>
      </DataState>
      <DemoControls onLoad={(mode) => void reload(mode)} />
    </PageContainer>
  );
}
