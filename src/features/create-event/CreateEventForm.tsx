import { Alert, Button, MenuItem, Paper, TextField } from "@mui/material";
import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useEvents } from "../../entities/event/model/context";
import { categories } from "../../entities/event/model/types";
import { errorMessage } from "../../shared/lib/errors";
import {
  initialValues,
  toEventDraft,
  validateEvent,
  type EventFormValues,
  type FormErrors,
} from "./validation";
import { PosterUpload } from "./PosterUpload";

export function CreateEventForm() {
  const { createEvent } = useEvents();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [posterUrl, setPosterUrl] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  function update(key: keyof EventFormValues, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (saving || saved || uploading) return;
    const validation = validateEvent(values);
    setErrors(validation);
    setError("");
    if (Object.keys(validation).length) {
      const first = Object.keys(validation)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await createEvent(toEventDraft(values, posterUrl));
      setSaved(true);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }
  if (saved)
    return (
      <Paper className="save-success" role="status">
        <span className="success-icon">Готово</span>
        <h2>Событие отправлено на модерацию</h2>
        <p>
          Оно сохранено в этом браузере. После одобрения событие появится в
          общей афише.
        </p>
        <div className="button-row">
          <Button component={RouterLink} to="/moderation" variant="contained">
            Перейти к модерации
          </Button>
          <Button
            onClick={() => {
              setValues(initialValues);
              setPosterUrl(undefined);
              setSaved(false);
            }}
          >
            Создать ещё событие
          </Button>
        </div>
      </Paper>
    );
  const field = (key: keyof EventFormValues, label: string) => ({
    name: key,
    label,
    value: values[key],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      update(key, event.target.value),
    error: Boolean(errors[key]),
    helperText: errors[key],
    fullWidth: true,
    disabled: saving,
    required: true,
  });
  return (
    <div className="create-layout">
      <PosterUpload
        value={posterUrl}
        onChange={setPosterUrl}
        disabled={saving}
        onLoading={setUploading}
      />
      <Paper
        component="form"
        ref={form}
        className="form-card"
        noValidate
        onSubmit={(event) => void submit(event)}
        aria-busy={saving}
      >
        <div className="form-title">
          <h2>Информация о событии</h2>
          <span>Все поля обязательны</span>
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          {...field("title", "Название события")}
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
        <div className="form-row">
          <TextField
            {...field("date", "Дата")}
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            {...field("time", "Время (МСК)")}
            type="time"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </div>
        <TextField {...field("category", "Категория")} select>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          {...field("place", "Место проведения")}
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
        <TextField
          {...field("address", "Адрес")}
          slotProps={{ htmlInput: { maxLength: 300 } }}
        />
        <TextField
          {...field("description", "Описание")}
          multiline
          minRows={3}
          slotProps={{ htmlInput: { maxLength: 3000 } }}
        />
        <Button
          type="submit"
          disabled={saving || uploading}
          variant="contained"
          fullWidth
        >
          {saving
            ? "Сохраняем…"
            : uploading
              ? "Загружаем афишу…"
              : "Отправить на модерацию"}
        </Button>
        <small className="muted">
          Время события указывается по Москве (UTC+3).
        </small>
      </Paper>
    </div>
  );
}
