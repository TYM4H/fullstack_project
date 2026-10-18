import { Button } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { EventCard } from "../entities/event/ui/EventCard";
import { useEvents } from "../entities/event/model/context";
import { EventFilters } from "../features/filter-events/EventFilters";
import { PageContainer } from "../shared/ui/PageContainer";
import { DataState } from "../shared/ui/DataState";
import { DemoControls } from "../shared/ui/DemoControls";

export function HomePage() {
  const { events, status, error, reload } = useEvents();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const category = params.get("category") || "";
  function changeFilter(key: string, value: string) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }
  const visible = events
    .filter(
      (event) =>
        event.status === "published" &&
        (!category || event.category === category) &&
        `${event.title} ${event.place} ${event.address} ${event.description}`
          .toLocaleLowerCase("ru")
          .includes(query.trim().toLocaleLowerCase("ru")),
    )
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  return (
    <PageContainer>
      <section className="home-intro">
        <div>
          <p className="eyebrow">ГОРОДСКАЯ АФИША</p>
          <h1>Ближайшие события</h1>
          <p className="lead">
            Концерты, выставки, лекции и другие интересные события рядом с вами.
          </p>
          <EventFilters
            query={query}
            category={category}
            onQueryChange={(value) => changeFilter("q", value)}
            onCategoryChange={(value) => changeFilter("category", value)}
            onReset={() => setParams({})}
          />
        </div>
        <aside className="upload-promo">
          <p className="eyebrow">ДЛЯ ОРГАНИЗАТОРОВ</p>
          <h2>Создайте событие из афиши</h2>
          <p>
            Добавьте изображение и заполните информацию о событии. После
            проверки оно появится в афише.
          </p>
          <Button component={RouterLink} to="/create-event" variant="outlined">
            Загрузить афишу
          </Button>
        </aside>
      </section>
      <div className="list-heading">
        <h2>Афиша событий</h2>
        {status === "success" && (
          <span role="status">Найдено: {visible.length}</span>
        )}
      </div>
      <DataState
        status={status}
        error={error}
        onRetry={() => void reload()}
        empty={visible.length === 0}
        emptyTitle="События не найдены"
        emptyDescription="Измените запрос или категорию. Новые события появятся здесь после одобрения модератором."
      >
        <section className="event-grid" aria-label="События">
          {visible.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      </DataState>
      <DemoControls onLoad={(mode) => void reload(mode)} />
    </PageContainer>
  );
}
