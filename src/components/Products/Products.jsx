import React from "react";
import { Grid, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import Product from "./Product/Product";
import useStyles from "./productsStyles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Products = ({
  products,
  onAddToCart,
  setOpen,
  open,
  productAddedToCart,
  setProductAddedToCart,
}) => {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setProductAddedToCart({});
  };

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Grid container justify="center" spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Product product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))}
      </Grid>

      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {productAddedToCart.name} added to cart
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Products;
