'use client'
import {Box, Stack, Typography, Button, Modal, TextField} from '@mui/material'
import { useEffect, useState } from 'react'
import { firestore } from '@/firebase'
import {collection, query, getDoc, getDocs, setDoc, doc, deleteDoc} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  gap: 3,
  display: 'flex',
  flexDirection: 'column'
};

export default function Home() {
  const [pantry, setPantry] = useState([])

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState('')

  const updatePantry = async () => {
    const snapshot = query(collection(firestore,'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push(doc.id)
    })
    console.log(pantryList)
    setPantry(pantryList)
  }

  useEffect( ()=> {
    updatePantry()
  },[])

  const addItem = async (item) =>{
    const docRef =  doc(collection(firestore,'pantry'),item)
    await setDoc(docRef, {})
    await updatePantry()
  }

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore,'pantry'), item)
    await deleteDoc(docRef)
    await updatePantry()
  }

  return (<Box
    width="100vw" 
    height="100vh"
    display={"flex"}
    justifyContent={"center"}
    flexDirection={'column'}
    alignItems={"center"}
    gap={2}
    >
      <Modal
      open={open}
        onClose={handleClose}
        aria-labelledby="item-adder"
        aria-describedby="item-adder-description"
      >
        <Box sx={style}>
          <Typography id="item-adder" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width ="100%" direction={'row'} spacing={2}>
            <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth 
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}/>
            <Button variant="outlined" 
            onClick={()=>{
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>Add</Button>
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
        {pantry.map((i)=>(
          <Box
            key={i}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#F0F0F0'}
            paddingX={5}
          >
            <Typography
              variant={'h3'}
              color={'#333'}
              textAlign={'center'}
            >
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </Typography>
            <Button variant='contained' onClick={() => removeItem(i)}>Remove</Button>
          </Box>
        ))}
        </Stack>
      </Box>
  </Box>
  );
}
