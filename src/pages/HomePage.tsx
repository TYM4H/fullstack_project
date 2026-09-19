import { Button, Chip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { EventCard } from "../components/EventCard";
import { PageContainer } from "../components/PageContainer";
import { events } from "../data/events";

export function HomePage() {
  return (
    <PageContainer>
      <section className="home-intro">
        <div>
          <p className="eyebrow">ГОРОДСКАЯ АФИША</p>
          <h1>Ближайшие события</h1>
          <p className="lead">
            Концерты, выставки, лекции и другие интересные события рядом с вами.
          </p>
          <div className="search-box">
            <span>Поиск событий, исполнителей, площадок...</span>
            <b>Москва</b>
          </div>
          <div className="chips">
            {[
              "Все события",
              "Концерты",
              "Выставки",
              "Лекции",
              "Театр",
              "Фестивали",
            ].map((item, i) => (
              <Chip
                key={item}
                label={item}
                className={i === 0 ? "chip-selected" : ""}
              />
            ))}
          </div>
        </div>
        <aside className="upload-promo">
          <p className="eyebrow">ИИ-ПОМОЩНИК</p>
          <h2>Создайте событие из афиши</h2>
          <p>
            Загрузите изображение - мы распознаем информацию и поможем заполнить
            карточку.
          </p>
          <Button component={RouterLink} to="/create-event" variant="outlined">
            Загрузить афишу
          </Button>
        </aside>
      </section>
      <section className="event-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </section>
    </PageContainer>
  );
}
