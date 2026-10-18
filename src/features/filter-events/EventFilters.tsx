import { Button, Chip, TextField } from "@mui/material";
import { categories, type Category } from "../../entities/event/model/types";

type EventFiltersProps = {
  query: string;
  category: string;
  onQueryChange: (query: string) => void;
  onCategoryChange: (category: Category | "") => void;
  onReset: () => void;
};
export function EventFilters({
  query,
  category,
  onQueryChange,
  onCategoryChange,
  onReset,
}: EventFiltersProps) {
  return (
    <div className="event-filters">
      <TextField
        label="Поиск событий и площадок"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        fullWidth
      />
      <div className="chips" role="group" aria-label="Категории событий">
        {["", ...categories].map((item) => (
          <Chip
            key={item}
            label={item || "Все события"}
            onClick={() => onCategoryChange(item as Category | "")}
            aria-pressed={category === item}
            className={category === item ? "chip-selected" : ""}
          />
        ))}
      </div>
      {(query || category) && (
        <Button onClick={onReset}>Сбросить фильтры</Button>
      )}
    </div>
  );
}
