import { Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material'
import { PageContainer } from '../components/PageContainer'
import { events } from '../data/events'

export function ModerationPage() {
  return (
    <PageContainer>
      <Typography component="h1" variant="h4" gutterBottom>События на модерации</Typography>
      <Paper><List>{events.map((event) => (
        <ListItem key={event.id} secondaryAction={<Button size="small">Проверить</Button>}>
          <ListItemText primary={event.title} secondary={`${event.date}, ${event.place}`} />
        </ListItem>
      ))}</List></Paper>
    </PageContainer>
  )
}
