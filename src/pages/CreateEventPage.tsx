import { Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { PageContainer } from '../components/PageContainer'

export function CreateEventPage() {
  return (
    <PageContainer>
      <Typography component="h1" variant="h4" gutterBottom>Создание события</Typography>
      <Paper sx={{ maxWidth: 600, p: 3 }}>
        <Stack spacing={2}>
          <Button component="label" variant="outlined">Загрузить афишу<input hidden type="file" accept="image/*" /></Button>
          <Typography color="text.secondary">После загрузки здесь появятся данные, распознанные из афиши.</Typography>
          <TextField label="Название события" />
          <TextField label="Дата и время" />
          <TextField label="Место проведения" />
          <TextField label="Описание" multiline minRows={3} />
          <Button variant="contained">Сохранить событие</Button>
        </Stack>
      </Paper>
    </PageContainer>
  )
}
