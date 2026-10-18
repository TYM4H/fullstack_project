import { Alert, Button } from "@mui/material";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { validatePoster } from "./validation";

export function PosterUpload({
  value,
  onChange,
  disabled,
  onLoading,
}: {
  value?: string;
  onChange: (value?: string) => void;
  disabled: boolean;
  onLoading: (loading: boolean) => void;
}) {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [reading, setReading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  async function select(file?: File) {
    if (!file || disabled || reading) return;
    const message = validatePoster(file);
    setError(message);
    if (message) return;
    setReading(true);
    onLoading(true);
    try {
      const url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
        reader.readAsDataURL(file);
      });
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () =>
          reject(new Error("Файл не является корректным изображением."));
        image.src = url;
      });
      setName(file.name);
      onChange(url);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Не удалось загрузить афишу.",
      );
    } finally {
      setReading(false);
      onLoading(false);
    }
  }
  function drop(event: DragEvent) {
    event.preventDefault();
    void select(event.dataTransfer.files[0]);
  }
  function change(event: ChangeEvent<HTMLInputElement>) {
    void select(event.target.files?.[0]);
    event.target.value = "";
  }
  return (
    <section
      className="drop-zone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={drop}
      aria-label="Загрузка афиши"
    >
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Выберите афишу"
        onChange={change}
        disabled={disabled || reading}
      />
      <p className="eyebrow">АФИША СОБЫТИЯ</p>
      <h2>{value ? "Афиша загружена" : "Добавьте афишу"}</h2>
      <p>
        {reading
          ? "Проверяем изображение…"
          : "Перетащите изображение или выберите файл"}
      </p>
      <small>JPG, PNG, WebP · до 2 МБ · необязательно</small>
      {error && <Alert severity="error">{error}</Alert>}
      {value && (
        <>
          <img
            className="poster-preview"
            src={value}
            alt={`Предпросмотр афиши: ${name}`}
          />
          <p className="file-name">{name}</p>
        </>
      )}
      <Button
        type="button"
        onClick={() => input.current?.click()}
        variant="outlined"
        disabled={disabled || reading}
      >
        {value ? "Заменить афишу" : "Выбрать файл"}
      </Button>
      {value && (
        <Button
          type="button"
          onClick={() => {
            onChange(undefined);
            setName("");
            setError("");
          }}
          disabled={disabled || reading}
        >
          Удалить афишу
        </Button>
      )}
      <p className="upload-note">
        Данные заполняются вручную. Распознавание текста будет подключено на
        следующем этапе.
      </p>
    </section>
  );
}
