import {Box, Stack, Typography, colors} from '@mui/material'
const item = ['onion','tomato','lettuce','cucumber','garlic','ginger','carrot']

export default function Home() {
  return (<Box
    width="100vw" 
    height="100vh"
    display={"flex"}
    justifyContent={"center"}
    flexDirection={'column'}
    alignItems={"center"}
    >
      <Box border={'1px solid #333'}>
        <Box 
        width="800px"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}>
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px"height="300px"spacing={2} overflow={'auto'}>
        {item.map((i)=>(
          <Box
            key={i}
            width="100%"
            height="300px"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            bgcolor={'#F0F0F0'}
          >
            <Typography
              variant={'h3'}
              color={'#333'}
              textAlign={'center'}
            >
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </Typography>
          </Box>
        ))}
        </Stack>
      </Box>
  </Box>
  );
}
