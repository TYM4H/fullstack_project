import { Button } from "@mui/material";

export function DemoControls({
  onLoad,
}: {
  onLoad: (mode: "normal" | "empty" | "error") => void;
}) {
  return (
    <details className="demo-controls">
      <summary>Демонстрация состояний данных</summary>
      <p>
        Учебный режим: изменения сохраняются в этом браузере. Эти кнопки
        временно меняют отображение и не удаляют сохранённые события.
      </p>
      <div className="button-row">
        <Button onClick={() => onLoad("normal")}>Загрузить данные</Button>
        <Button onClick={() => onLoad("empty")}>Пустой список</Button>
        <Button onClick={() => onLoad("error")}>Ошибка загрузки</Button>
      </div>
    </details>
  );
}
