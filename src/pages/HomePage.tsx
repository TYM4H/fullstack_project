import { Grid, Typography } from '@mui/material'
import { EventCard } from '../components/EventCard'
import { PageContainer } from '../components/PageContainer'
import { events } from '../data/events'

export function HomePage() {
  return (
    <PageContainer>
      <Typography component="h1" variant="h4" gutterBottom>Ближайшие события</Typography>
      <Grid container spacing={2}>
        {events.map((event) => <Grid key={event.id} size={{ xs: 12, sm: 6 }}><EventCard event={event} /></Grid>)}
      </Grid>
    </PageContainer>
  )
}
