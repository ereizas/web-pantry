'use client'
import { Box, Stack, Typography, Button, Modal, TextField, Card, CardContent, CardActions, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { firestore } from '@/firebase'
import { collection, query, getDoc, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  pt: 2,
  px: 4,
  pb: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
};

const headerStyle = {
  backgroundColor: '#C8E6C9',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid #ddd',
  padding: '16px',
  borderRadius: '8px'
};

const cardStyle = {
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#FFF9C4'
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0056b3'
  }
};

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [filteredPantry, setFilteredPantry] = useState([])
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [itemName, setItemName] = useState('')
  const [filter, setFilter] = useState('')

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
    if (filter === '') {
      setFilteredPantry(pantry)
    } else {
      const filtered = pantry.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      )
      setFilteredPantry(filtered)
    }
  }, [filter, pantry])

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
      bgcolor="#E8F5E9"
    >
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
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
            <Button variant="contained"
              sx={buttonStyle}
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
      <Box display={"flex"} flexDirection={"column"} width="60%" justifyContent={"space-between"} alignItems="center" gap={2} mb={2} position="sticky" top={0} sx={headerStyle}>
        <TextField
          id="filter-field"
          label="Filter"
          variant="outlined"
          fullWidth
          value={filter}
          onChange={(e) => setFilter(e.target.value)} />
        <Button variant="contained" sx={buttonStyle} onClick={handleOpen}>Add New Item</Button>
      </Box>
      <Typography variant={'h4'} color={'#333'} textAlign={'center'} mb={2}>
        Pantry Items
      </Typography>
      <Box width="80%" mt={2} maxHeight="60vh" overflow="auto">
        <Stack spacing={2}>
          {filteredPantry.map(({ name, count }) => (
            <Card key={name} sx={cardStyle} variant="outlined">
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
                  <AddIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => removeItem(name)}>
                  <RemoveIcon color="error" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}