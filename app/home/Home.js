import React, { useState } from 'react';
import { Grid, Typography, Button, Card, CardContent, CardActions, CardMedia, AppBar, Toolbar, InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const items = [
  { id: 1, name: 'Fried Chicken', price: 10, image: 'https://th.bing.com/th/id/R.cb182248100eedb0482c648c52fdd112?rik=LZ6TBSIgTXyU7w&riu=http%3a%2f%2fstatic3.businessinsider.com%2fimage%2f56be399e2e526558008b7091-1333-1000%2ffried-chicken.jpg&ehk=7yk5YorCaCrCBwdJS8plwF2onEYnPlUxKKZXhpSj2NU%3d&risl=&pid=ImgRaw&r=0.jpg' },
  {id: 2, name: 'Spaghetti', price: 20, image: 'https://th.bing.com/th/id/OIP.AX3eF50qIH9YKzMZT0Zo0wHaE6?rs=1&pid=ImgDetMain' },
  { id: 3, name: 'Noodles',  price: 25, image:'https://tasteofperth.files.wordpress.com/2011/05/img_3464.jpg'},
  { id: 4, name: 'Burger', price: 30,image:'https://4.bp.blogspot.com/-RIh2M4MJCRk/Vr5pG8sbUxI/AAAAAAAAmBo/KNc5ln_bW8Y/s1600/yum.jpg'},
  { id: 5, name: 'Pizza', price: 23,image:'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?cs=srgb&dl=pizza-2619967.jpg&fm=jpg' },
  { id: 6, name: 'Sandwich ham/cheese',price: 17, image:'https://bigoven-res.cloudinary.com/image/upload/t_recipe-1280/grilled-cheese-and-ham-sandwic-71d134.jpg' },
  { id: 7, name: 'Chicken Burger',price: 20, image:'https://th.bing.com/th/id/OIP.X3OWtmBoLynaTq8mw9wPBwHaHa?rs=1&pid=ImgDetMain' },
  { id: 8, name: 'Siomai', price: 22,image:'https://i.pinimg.com/originals/46/dc/bf/46dcbfc15c9113853aaec3d5ddeb3cf7.jpg' },
  { id: 9, name: 'Mineral Water', price: 18,image:'https://www.pngitem.com/pimgs/m/59-598766_since-1991-nature-s-spring-brings-you-safe.png'},
  { id: 10, name: 'Coca Cola', price: 18,image:'https://th.bing.com/th/id/OIP.XPeA4yUdGdb5prLG_XlUAwHaE8?rs=1&pid=ImgDetMain'},
  { id: 11, name: 'Pepsi', price: 18,image:'https://th.bing.com/th/id/OIP.DAaWq7TLmQjZ8FzohPPUQAHaE8?rs=1&pid=ImgDetMain'},
  { id: 12, name: 'sprite', price: 18,image:'https://th.bing.com/th/id/OIP.DsjAQ0lJgs0PMh38C7E1MAAAAA?w=364&h=320&rs=1&pid=ImgDetMain'},
  
];

const OrderList = ({ orders, onDelete }) => (
  <div style={{ marginLeft: '20px', width: '100%' }}>
    <Typography variant="h5" gutterBottom>
      List of Orders
    </Typography>
    {orders.map((order, index) => (
      <Card key={index} style={{ marginBottom: '20px', backgroundColor: '#f0f0f0' }}>
        <CardContent>
          <Typography variant="subtitle1">Order Number: {order.orderNumber}</Typography>
          {order.items.map((item, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <Typography variant="subtitle2">{item.name}</Typography>
              <Typography variant="body2">{item.description}</Typography>
              <Typography variant="body1">₱{item.price}</Typography>
              <Typography variant="body2">Quantity: {item.quantity}</Typography>
            </div>
          ))}
          <Typography variant="h6" gutterBottom>
            Total: ₱{order.total}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="secondary" onClick={() => onDelete(order.orderNumber)}>
            Delete Order
          </Button>
        </CardActions>
      </Card>
    ))}
  </div>
);

const App = () => {
  const [cart, setCart] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);
  const [checkoutView, setCheckoutView] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const generateOrderNumber = () => {
   
    return Math.floor(1000 + Math.random() * 9000);
  };

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      
      const orderNum = generateOrderNumber();
      setOrderNumber(orderNum);
      setCart([...cart, { ...item, orderNumber: orderNum, quantity: 1 }]);
    }
  };

  const removeFromCart = (orderNumToRemove, itemIdToRemove) => {
    const updatedCart = cart.map((item) => {
      if (item.orderNumber === orderNumToRemove && item.id === itemIdToRemove && item.quantity > 0) {
      
        const updatedQuantity = item.quantity - 1;
        if (updatedQuantity === 0) {
          
          return null;
        } else {
          return { ...item, quantity: updatedQuantity };
        }
      }
      return item;
    }).filter(Boolean); 

    
    setCart(updatedCart);
  };

  
  const getTotalPayment = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to proceed to checkout.");
    } else {
      setCheckoutView(true);
      const total = getTotalPayment();
      setOrders([...orders, { orderNumber, items: cart, total }]);
      setCart([]);
      setOrderNumber(null); 
    }
  };

  const handleBackToMenu = () => {
    setCheckoutView(false);
  };

  const handleDeleteOrder = (orderNumberToDelete) => {
    const updatedOrders = orders.filter((order) => order.orderNumber !== orderNumberToDelete);
    setOrders(updatedOrders);
  };

  const handleViewOrders = () => {
    setCheckoutView(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleVoiceButtonClick = () => {
    setListening(!listening);
    if (!listening) {
      
      startListening();
    } else {
      
      stopListening();
    }
  };

  const startListening = () => {
   
    setTranscript('Listening...');
  };

  const stopListening = () => {
    
    setTranscript('Listening stopped.');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <AppBar position="static" sx= {{ backgroundColor: '#fff', color: 'black', width: '100%' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Ordering System for School Canteen
          </Typography>
          <Paper component="form" elevation={0} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 'fit-content', backgroundColor: '#f0f0f0', borderRadius: 4 }}>
            <InputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ ml: 1, flex: 1 }}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ p: '10px' }} aria-label="voice" onClick={handleVoiceButtonClick}>
              {listening ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StopIcon />
                  <Typography variant="body2" sx={{ ml: 1 }}>{transcript}</Typography>
                </div>
              ) : (
                <MicIcon />
              )}
            </IconButton>
          </Paper>
          {!checkoutView ? (
            <Button color="inherit" onClick={handleCheckout} sx={{ color: 'orange' }}>
              Checkout
            </Button>
          ) : (
            <Button color="inherit" onClick={handleBackToMenu} sx={{ color: 'orange' }}>
              Back to Menu
            </Button>
          )}
          {orders.length > 0 && (
            <Button color="inherit" onClick={handleViewOrders} sx={{ color: 'orange' }}>
              View Orders
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {!checkoutView ? (
        <Grid container spacing={0} style={{ marginTop: '1rem' }}>
          <Grid item xs={12} md={9}>
            <Typography variant="h5" gutterBottom>
              Menu
            </Typography>
            <Grid container spacing={1}>
              {items
                .filter((item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <Grid item key={item.id} xs={12} sm={6} md={3} lg={3}>
                    <Card sx={{ maxWidth: '95%', backgroundColor: '#fff' , borderRadius: 8,boxShadow: '0 2px 4px rgba(1, 1, 1, 0.6)'}}>
                      <CardMedia
                        component="img"
                        height="150"
                        width="100%"
                        image={item.image}
                        alt={item.name}
                        sx={{
                          borderRadius: 8,
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                        <Typography variant="body1">₱{item.price}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => addToCart(item)}
                          sx={{
                            color: 'white',
                            backgroundColor: '#f44336',
                            '&:hover': {
                              backgroundColor: '#d32f2f',
                            },
                          }}
                        >
                          BUY
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h5" gutterBottom>
              Shopping Cart
            </Typography>
            {cart.map((item) => (
              <Card key={item.id} style={{ marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '20px', boxShadow: '0 2px 4px rgba(1, 1, 1, 0.6)', backgroundColor: '#fff' }}>
                <CardContent>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                  <Typography variant="body1">₱{item.price}</Typography>
                  <Typography variant="body2">Quantity: {item.quantity}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeFromCart(item.orderNumber, item.id)}
                    sx={{ minWidth: 'auto' }}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            ))}
            <Typography variant="h6" gutterBottom>
              Total: ₱{getTotalPayment()}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <OrderList orders={orders} onDelete={handleDeleteOrder} />
      )}
    </div>
  );
};

export default App;
