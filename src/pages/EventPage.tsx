import { Button, Paper, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { PageContainer } from '../components/PageContainer'
import { events } from '../data/events'

export function EventPage() {
  const { id } = useParams()
  const event = events.find((item) => item.id === Number(id))
  if (!event) return <PageContainer><Typography variant="h5">Событие не найдено</Typography></PageContainer>

  return (
    <PageContainer>
      <Paper sx={{ p: 3 }}>
        <Typography component="h1" variant="h4">{event.title}</Typography>
        <Typography sx={{ mt: 2 }}>{event.date}, {event.time}</Typography>
        <Typography>{event.place}</Typography>
        <Typography sx={{ mt: 2 }}>{event.description}</Typography>
        <Button component={RouterLink} to="/ticket" sx={{ mt: 2 }} variant="contained">Получить билет</Button>
      </Paper>
    </PageContainer>
  )
}
