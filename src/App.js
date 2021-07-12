import React, { useState, useEffect } from "react";

import { commerce } from "./lib/commerce";

import Products from "./components/Products/Products";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/CheckoutForm/Checkout/Checkout";

// react router to move between pages
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [productAddedToCart, setProductAddedToCart] = useState({});

  // this function is used to fetchProducts from commerce when app starts
  const fetchProducts = async () => {
    // const response = await commerce.products.list();

    // 'commerce.products.list()' will return json data(response) and in response there is a field called data
    // so we destructure that
    const { data } = await commerce.products.list();

    // then we save that data in 'useState'
    setProducts(data);
  };

  const fetchCart = async () => {
    const cart = await commerce.cart.retrieve();

    setCart(cart);
  };

  const handleAddToCart = async (productId, quantity, product) => {
    const item = await commerce.cart.add(productId, quantity);

    // this is the updated cart (after saving the added item)
    setCart(item.cart);
    setOpen(true);
    setProductAddedToCart(product);
    // console.log(product);
  };

  const handleUpdateCartQty = async (productId, quantity) => {
    // we put quantity in object because quantity is one of the thing that we want to update
    const response = await commerce.cart.update(productId, { quantity });

    setCart(response.cart);
  };

  const handleRemoveFromCart = async (productId) => {
    const response = await commerce.cart.remove(productId);

    setCart(response.cart);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();

    setCart(response.cart);
  };

  // this is the function which will refresh the cart after we checkout and successfully place an order
  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    // here we set the Cart to empty or fresh
    setCart(newCart);
  };

  // this is the last method which will handle the checkout
  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );

      setOrder(incomingOrder);
      refreshCart();
    } catch (error) {
      setErrorMsg(error.data.error.message);
    }
  };

  // useEffetc is use to run at 'start'
  // its a hook and its dependecy array is empty because we want to run it at 'start'
  // so here when app starts we call fetchProducts function which will return the products
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // console.log(cart);

  return (
    <Router>
      <div>
        {/* we always want to show this navbar so its not in switch */}
        <Navbar totalItems={cart.total_items} />

        {/* Switch is used to switch between two Routes */}
        <Switch>
          <Route exact path="/">
            <Products
              products={products}
              onAddToCart={handleAddToCart}
              setOpen={setOpen}
              open={open}
              productAddedToCart={productAddedToCart}
              setProductAddedToCart={setProductAddedToCart}
            />
          </Route>

          <Route exact path="/cart">
            <Cart
              cart={cart}
              handleUpdateCartQty={handleUpdateCartQty}
              handleRemoveFromCart={handleRemoveFromCart}
              handleEmptyCart={handleEmptyCart}
            />
          </Route>

          <Route exact path="/checkout">
            <Checkout
              cart={cart}
              order={order}
              onCaptureCheckout={handleCaptureCheckout}
              error={errorMsg}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
