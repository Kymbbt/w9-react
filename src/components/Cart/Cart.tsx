import * as _React  from 'react'; 
import { useState, useEffect } from 'react'; 
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Stack,
    Typography,
    Snackbar,
    Alert } from '@mui/material'; 
import InfoIcon from '@mui/icons-material/Info';
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';


import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { ShopProps } from '../../customHooks';
import { shopStyles } from '../Shop';
import { serverCalls } from '../../api';
import { MessageType } from '../Auth'; 


export const Cart = () => {

    const db = getDatabase();
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const [ currentCart, setCurrentCart ] = useState<ShopProps[]>()
    const userId = localStorage.getItem('uuid')
    const cartRef = ref(db, `carts/${userId}/`); 


    
    useEffect(()=> {


        
        onValue(cartRef, (snapshot) => {
            const data = snapshot.val() 

            
            let cartList = []

            if (data){
                for (let [key, value] of Object.entries(data)){
                    let cartItem = value as ShopProps
                    cartItem['id'] = key
                    cartList.push(cartItem)
                }
            }

            setCurrentCart(cartList as ShopProps[])
        })

        
        return () => {
            off(cartRef)
        }
    },[])

    
    
    const updateQuantity = async (id: string, operation: string) => {

        
        const dataIndex = currentCart?.findIndex((cart) => cart.id === id) 


        
        const updatedCart = [...currentCart as ShopProps[]]
        if (operation === 'dec'){
            updatedCart[dataIndex as number].quantity -= 1
        } else {
            updatedCart[dataIndex as number].quantity += 1
        }

        setCurrentCart(updatedCart)
    }

    
    const updateCart = async ( cartItem: ShopProps ) => {

        const itemRef = ref(db, `carts/${userId}/${cartItem.id}`)


        
        update(itemRef, {
            quantity: cartItem.quantity
        })
        .then(() => {
            setMessage('Successfully Updated Your Cart')
            setMessageType('success')
            setOpen(true)
        })
        .then(() => {
            setTimeout(() => window.location.reload(), 2000)
        })
        .catch((error) => {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }


    
    const deleteItem = async (cartItem: ShopProps ) => {

        const itemRef = ref(db, `carts/${userId}/${cartItem.id}`)


        
        remove(itemRef)
        .then(() => {
            setMessage('Successfully Deleted Item from Cart')
            setMessageType('success')
            setOpen(true)
        })
        .then(() => {
            setTimeout(() => window.location.reload(), 2000)
        })
        .catch((error) => {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }



    return (
        <Box sx={shopStyles.main}>
            <NavBar />
            <Stack direction = 'column' sx={shopStyles.main}>
                <Stack direction = 'row' alignItems = 'center' sx={{marginTop: '100px', marginLeft: '200px'}}>
                    <Typography 
                        variant = 'h4'
                        sx = {{ marginRight: '20px'}}
                    >
                        Your Cart
                    </Typography>
                    <Button color = 'primary' variant = 'contained' onClick={()=>{}} >Checkout </Button>
                </Stack>
                <Grid container spacing={3} sx={shopStyles.grid}>
                    {currentCart?.map((cart: ShopProps, index: number) => (
                        <Grid item key={index} xs={12} md={6} lg={4}>
                            <Card sx={shopStyles.card}>
                                <CardMedia 
                                    component = 'img'
                                    sx = {shopStyles.cardMedia}
                                    image = {cart.image}
                                    alt = {cart.name}
                                />
                                <CardContent>
                                    <Stack direction = 'column' justifyContent='space-between' alignItems = 'center'>
                                        <Accordion sx = {{color: 'white', backgroundColor: theme.palette.secondary.light}}>
                                            <AccordionSummary 
                                                expandIcon={<InfoIcon sx={{color: theme.palette.primary.main}}/>}
                                            >
                                                <Typography>{cart.name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>{cart.description}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Stack 
                                            direction = 'row' 
                                            alignItems = 'center' 
                                            justifyContent='space-between' 
                                            sx={shopStyles.stack2}
                                        >
                                            <Button 
                                                size='large'
                                                variant='text'
                                                onClick={()=>{updateQuantity(cart.id, 'dec')}}
                                            >-</Button>
                                            <Typography variant = 'h6' sx={{color: 'white'}}>
                                                {cart.quantity}
                                            </Typography>
                                            <Button 
                                                size='large'
                                                variant='text'
                                                onClick={()=>{updateQuantity(cart.id, 'inc')}}
                                            >+</Button>
                                        </Stack>
                                        <Button 
                                            size = 'medium'
                                            variant = 'outlined'
                                            sx = {shopStyles.button}
                                            onClick = {()=>{updateCart(cart)}}
                                        >
                                            Update Quantity = ${(cart.quantity * parseFloat(cart.price)).toFixed(2)}
                                        </Button>
                                        <Button 
                                            size = 'medium'
                                            variant = 'outlined'
                                            sx = {shopStyles.button}
                                            onClick = {()=>{deleteItem(cart)}}
                                        >
                                            Delete Item From Cart
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>

                        </Grid>
                    ))}
                </Grid>
            </Stack>

        </Box>
    )
}