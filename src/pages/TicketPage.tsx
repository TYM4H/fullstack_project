import { Button } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useEvents } from "../entities/event/model/context";
import { formatEventDate } from "../shared/lib/date";
import { PageContainer } from "../shared/ui/PageContainer";
import { DataState } from "../shared/ui/DataState";

export function TicketPage() {
  const [params] = useSearchParams();
  const { tickets, status, error, reload } = useEvents();
  const ticket = tickets.find((item) => item.id === params.get("ticketId"));
  const formatted = ticket ? formatEventDate(ticket.event.startsAt) : null;
  function download() {
    if (!ticket || !formatted) return;
    const content = `УЧЕБНЫЙ БИЛЕТ\n${ticket.event.title}\n${formatted.date} · ${formatted.time} МСК\n${ticket.event.place}\n${ticket.event.address}\nНомер: ${ticket.id}\nОформлен: ${new Date(ticket.issuedAt).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} МСК\nДемонстрация: не является действительным входным билетом.\n`;
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `ticket-${ticket.id}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <PageContainer>
      <Button
        component={RouterLink}
        to={ticket ? `/events/${ticket.eventId}` : "/"}
      >
        {ticket ? "← К событию" : "К афише событий"}
      </Button>
      <DataState
        status={status}
        error={error}
        onRetry={() => void reload()}
        empty={!ticket}
        emptyTitle="Билет не найден"
        emptyDescription="Откройте опубликованное событие и нажмите «Получить билет». Билеты хранятся в браузере, в котором были оформлены."
      >
        {ticket && formatted && (
          <div className="ticket-layout">
            <article className="ticket">
              <div className={`ticket-top ${ticket.event.posterClass}`}>
                <span>АФИША СОБЫТИЙ · УЧЕБНЫЙ БИЛЕТ</span>
                <strong>{ticket.event.title}</strong>
              </div>
              <div className="ticket-info">
                <h1>{ticket.event.title}</h1>
                <p>
                  {formatted.date} · {formatted.time} МСК
                </p>
                <p>{ticket.event.place}</p>
                <p>{ticket.event.address}</p>
              </div>
              <div className="ticket-bottom">
                <div>
                  <span>Номер билета</span>
                  <b className="ticket-number">{ticket.id}</b>
                  <small>Бесплатный демонстрационный билет</small>
                </div>
              </div>
            </article>
            <aside className="ticket-help">
              <span className="success-icon">Готово</span>
              <h2>Билет оформлен!</h2>
              <b className="paid">Учебное оформление · бесплатно</b>
              <p>
                Скачайте данные билета или сохраните печатную версию через
                диалог печати браузера.
              </p>
              <div className="how-to">
                <h2>Об этом билете</h2>
                <p>
                  Данные соответствуют выбранному событию. Повторное оформление
                  возвращает тот же билет.
                </p>
                <p>
                  Оплата, действующий QR-код и проверка на входе будут добавлены
                  при интеграции с сервером.
                </p>
              </div>
              <div className="ticket-buttons">
                <Button onClick={download} variant="outlined" fullWidth>
                  Скачать билет (.txt)
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outlined"
                  fullWidth
                >
                  Распечатать билет
                </Button>
              </div>
            </aside>
          </div>
        )}
      </DataState>
    </PageContainer>
  );
}
