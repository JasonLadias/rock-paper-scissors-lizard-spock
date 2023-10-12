import { Container, Button, Box, TextField } from '@mui/material'
import { green, } from '@mui/material/colors'
import { FC, useState } from 'react'
import { useRouter } from 'next/router'


const HomePage: FC = () => {
  const router = useRouter()
  const [existingContract, setExistingContract] = useState<null | string>(null)

  const handleExistingContract = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExistingContract(e.target.value)
  }

  const goToExistingGame = () => {
    router.push(`/${existingContract}`)
  }

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <h1>Home Page</h1>
      <Button variant='contained'>Start New Game</Button>
      <Box sx={{ p: 2, bgcolor: green[200], display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', minWidth: 300}}>
        <p>OR ENTER PREVIOUS GAME <br /> SMART CONTRACT</p>
        <TextField id="outlined-basic" label="Enter Smart Contract" variant="outlined" fullWidth value={existingContract} onChange={handleExistingContract}/>
        <Button variant='contained' disabled={!existingContract} onClick={goToExistingGame}>Join Existing Game</Button>
      </Box>

    </Container>
  )
}

export default HomePage
