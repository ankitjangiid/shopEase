import React from "react";
import { Container, Typography, Button, Grid } from "@material-ui/core";
import CartItem from "./CartItem/CartItem";
import { Link } from "react-router-dom";

import useStyles from "./cartStyles";

const Cart = ({
  cart,
  handleUpdateCartQty,
  handleRemoveFromCart,
  handleEmptyCart,
}) => {
  const classes = useStyles();

  const EmptyCart = () => (
    <Typography variant="subtitle1">
      Your Cart is Empty,
      <Link to="/" className={classes.link}>
        Add someitems
      </Link>
    </Typography>
  );

  if (!cart.line_items) return "Loading...";

  const FilledCart = () => (
    <>
      <Grid container spacing={3}>
        {cart.line_items.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <CartItem
              item={item}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveFromCart={handleRemoveFromCart}
            />
          </Grid>
        ))}
      </Grid>

      <div className={classes.cardDetails}>
        <Typography variant="h4">
          Subtotal: {cart.subtotal.formatted_with_symbol}
        </Typography>

        <div>
          <Button
            className={classes.emptyButton}
            size="large"
            type="button"
            variant="contained"
            color="secondary"
            onClick={handleEmptyCart}
          >
            Empty Cart
          </Button>

          <Button
            component={Link}
            to="/checkout"
            className={classes.checkoutButton}
            size="large"
            type="button"
            variant="contained"
            color="primary"
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Container>
      {/* this div is just for padding */}
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h3" gutterBottom>
        My Cart
      </Typography>
      {/* to check if cart is empty or not */}
      {/* here this line means that if there is some value in 'cart.line_items.length' then render 'FilledCart' else render 'EmptyCart' */}
      {cart.line_items.length ? <FilledCart /> : <EmptyCart />}
    </Container>
  );
};

export default Cart;

// rafce
