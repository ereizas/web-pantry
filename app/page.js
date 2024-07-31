'use client'
import { Box, Stack, Typography, Button, Modal, TextField, Card, CardContent, CardActions, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { firestore } from '@/firebase'
import { collection, query, getDoc, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove'
import SearchIcon from '@mui/icons-material/Search'

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
  const [filteredPantry, setFilteredPantry] = useState([])
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() })
    })
    setPantry(pantryList)
    setFilteredPantry(pantryList)
  }

  useEffect(() => {
    updatePantry()
  }, [])

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredPantry(pantry)
    } else {
      const filtered = pantry.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPantry(filtered)
    }
  }, [searchQuery, pantry])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      await setDoc(docRef, { count: count + 1 })
    } else {
      await setDoc(docRef, { count: 1 })
    }
    await updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      if (count == 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { count: count - 1 })
      }
    }
    await updatePantry()
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={'column'}
      alignItems={"center"}
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="item-adder" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="add-item-field"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)} />
            <Button variant="outlined"
              onClick={() => {
                addItem(itemName.charAt(0).toUpperCase() + itemName.slice(1))
                setItemName('')
                handleClose()
              }}>
              Add
            </Button>
            <Button variant="outlined"
              onClick={() => {
                setItemName('')
                handleClose()
              }}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box display={"flex"} width="60%" alignItems="center" gap={2}>
        <TextField
          id="search-field"
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Box>
      <Button variant="contained" onClick={handleOpen}>Add New Item</Button>
      <Box width="80%" mt={2}>
        <Typography variant={'h4'} color={'#333'} textAlign={'center'} mb={2}>
          Pantry Items
        </Typography>
        <Stack spacing={2}>
          {filteredPantry.map(({ name, count }) => (
            <Card key={name} variant="outlined">
              <CardContent>
                <Typography variant={'h5'} color={'#333'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'body1'} color={'#555'}>
                  Quantity: {count}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => addItem(name)}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => removeItem(name)}>
                  <RemoveIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}