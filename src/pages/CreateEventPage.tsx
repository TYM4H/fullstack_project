import { Button, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { PageContainer } from "../components/PageContainer";

export function CreateEventPage() {
  const [uploaded, setUploaded] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <PageContainer>
      <div className="page-heading">
        <p className="eyebrow">НОВОЕ СОБЫТИЕ</p>
        <h1>Создайте событие из афиши</h1>
        <p className="lead">
          Загрузите афишу — ИИ распознает данные и поможет быстро создать
          событие.
        </p>
      </div>
      <div className="steps">
        <b>
          1 <span>Загрузите афишу</span>
        </b>
        <b>
          2 <span>Проверьте данные</span>
        </b>
        <b>
          3 <span>Опубликуйте</span>
        </b>
      </div>
      <div className="create-layout">
        <label className="drop-zone">
          <input
            type="file"
            accept="image/*"
            onChange={() => setUploaded(true)}
          />
          <h2>{uploaded ? "Афиша загружена" : "Перетащите афишу сюда"}</h2>
          <p>
            {uploaded
              ? "ИИ уже нашёл основные данные на изображении."
              : "или нажмите, чтобы выбрать файл"}
          </p>
          <small>JPG, PNG, PDF · до 10 МБ</small>
          <Button component="span" variant="outlined">
            Выбрать файл
          </Button>
          {uploaded && (
            <div className="fake-poster">
              ЖИВАЯ
              <br />
              МУЗЫКА
              <br />
              <small>12 ИЮЛЯ</small>
            </div>
          )}
        </label>
        <Paper className="form-card">
          <div className="form-title">
            <h2>Проверьте информацию</h2>
            <span>Распознано из афиши</span>
          </div>
          <TextField
            label="Название события"
            defaultValue="Живая музыка"
            helperText="Уверенность ИИ: 95%"
            fullWidth
          />
          <div className="form-row">
            <TextField label="Дата" defaultValue="12.07.2026" fullWidth />
            <TextField label="Время" defaultValue="19:00" fullWidth />
          </div>
          <TextField
            label="Место проведения"
            defaultValue="Городской парк"
            fullWidth
          />
          <TextField
            label="Описание"
            defaultValue="Концерт живой музыки. Инди, рок, поп и друзья."
            minRows={3}
            multiline
            fullWidth
          />
          <Button onClick={() => setSaved(true)} variant="contained" fullWidth>
            {saved ? "Событие сохранено" : "Сохранить событие"}
          </Button>
        </Paper>
      </div>
    </PageContainer>
  );
}
