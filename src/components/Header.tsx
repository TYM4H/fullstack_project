import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function Header() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
        <Typography component={RouterLink} to="/" variant="h6" sx={{ color: 'inherit', flexGrow: 1, textDecoration: 'none' }}>
          Афиша событий
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">События</Button>
          <Button color="inherit" component={RouterLink} to="/create-event">Создать</Button>
          <Button color="inherit" component={RouterLink} to="/moderation">Модерация</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
