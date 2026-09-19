import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { Event } from '../types/event'

type EventCardProps = { event: Event }

export function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{event.title}</Typography>
        <Typography color="text.secondary">{event.date} · {event.time}</Typography>
        <Typography sx={{ mt: 1 }}>{event.place}</Typography>
      </CardContent>
      <CardActions>
        <Button component={RouterLink} to={`/events/${event.id}`} size="small">Подробнее</Button>
      </CardActions>
    </Card>
  )
}
