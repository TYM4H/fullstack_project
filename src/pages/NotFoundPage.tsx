import { Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { PageContainer } from '../components/PageContainer'

export function NotFoundPage() {
  return (
    <PageContainer>
      <Typography component="h1" variant="h4">404 — страница не найдена</Typography>
      <Button component={RouterLink} to="/" sx={{ mt: 2 }} variant="contained">На главную</Button>
    </PageContainer>
  )
}
