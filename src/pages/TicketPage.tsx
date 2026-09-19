import { Paper, Typography } from '@mui/material'
import { PageContainer } from '../components/PageContainer'

export function TicketPage() {
  return (
    <PageContainer>
      <Paper sx={{ maxWidth: 480, p: 3, textAlign: 'center' }}>
        <Typography component="h1" variant="h4">Ваш билет</Typography>
        <Typography sx={{ mt: 2 }}>Концерт группы «Север»</Typography>
        <Typography>20 сентября 2026, 19:00</Typography>
        <Typography sx={{ mt: 3, fontSize: 72 }}>▣</Typography>
        <Typography color="text.secondary">QR-код будет добавлен в следующих лабораторных работах.</Typography>
      </Paper>
    </PageContainer>
  )
}
