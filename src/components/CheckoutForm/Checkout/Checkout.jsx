import React, { useState, useEffect } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CssBaseline,
  Snackbar,
} from "@material-ui/core";

import MuiAlert from "@material-ui/lab/Alert";

import { Link, useHistory } from "react-router-dom";

// Commerce API
import { commerce } from "../../../lib/commerce";

import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import useStyles from "./checkoutStyles";

const steps = ["Shipping address", "Payment details"];

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
  const classes = useStyles();

  //   activeStep is the step on which we're currently on
  // we only have two activeSteps i.e 'Shipping address' and 'Payment details'
  const [activeStep, setActiveStep] = useState(0);

  // to store checkoutToken
  const [checkoutToken, setCheckoutToken] = useState({});

  // to store all the shipping data
  const [shippingData, setShippingData] = useState({});

  // this is just if we didn't have the card details
  const [isFinished, setIsFinished] = useState(false);

  const [open, setOpen] = useState(false);

  const history = useHistory();

  // checkout Tokken to pass in AddressFrom.jsx
  useEffect(() => {
    if (cart.id) {
      // here we noticed that we're making a function generateTokken and imidiately calling it so why we didn't call it when useEffect run direcly?
      // the answer is that, in useEffect we can not use async unless its in a new function
      const generateToken = async () => {
        try {
          const token = await commerce.checkout.generateToken(cart.id, {
            type: "cart",
          });

          // console.log(token);

          setCheckoutToken(token);

          // console.log(checkoutToken);
        } catch (error) {
          history.pushState("/");
        }
      };

      generateToken();
    }
    // here we add [cart] because we want to update the token as soon as we change the cart
    // here we write [cart] to represent that as soon as cart's value change recall the useEffect once more.
  }, [cart]);

  // to increase the activeStep by one or to move to next step
  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  // this is the function which get the data entered by the user
  const next = (data) => {
    setShippingData(data);

    // after we save the data we'll call the next step
    nextStep();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // this fun is used to start a timeout so that after user click pay this starts and after sometime we show a confirmation if we didn't have the card
  const timeout = () => {
    setTimeout(() => {
      setIsFinished(true);
      setOpen(true);
    }, 3000);
  };

  let Confirmation = () =>
    order.customer ? (
      <>
        <div>
          <Typography variant="h5">
            Order Placed Successfully, {order.customer.firstname}{" "}
            {order.customer.lastname}
          </Typography>
          <Divider className={classes.divider} />
          <Typography variant="subtitle2">
            Order ref: {order.customer_reference}
          </Typography>
          <br />
          <Button component={Link} to="/" variant="outlined" type="button">
            Back to Home
          </Button>
        </div>
      </>
    ) : isFinished ? (
      <>
        <div>
          <Typography variant="h5">Order Placed Successfully ✔</Typography>
          <Divider className={classes.divider} />
          <br />
          <Button component={Link} to="/" variant="outlined" type="button">
            Back to Home
          </Button>

          {/* this is the confimation message after we place an order */}
          <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Order Placed Successfully
            </Alert>
          </Snackbar>
        </div>
      </>
    ) : (
      // this is to show a spinner while data is generating
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );

  if (error) {
    <>
      <Typography variant="h5">Error: {error}</Typography>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button">
        Back to Home
      </Button>
    </>;
  }

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        nextStep={nextStep}
        backStep={backStep}
        timeout={timeout}
        onCaptureCheckout={onCaptureCheckout}
      />
    );

  return (
    <>
      {/* this is to adjust width for mobile */}
      <CssBaseline />
      {/* this is just for padding */}
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>

          {/* stepper is a component that moves as we move throught the steps */}
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* this means if we're on the last step */}
          {/* here we add one more thing i.e if wern't on last step then check if we have checkoutToken or not and if we do then only render the form otherwise don't render the form */}
          {/* we're doing this because when checkout.jsx runs it render all the component first (even before useEffect) and in this case we get an error because we're passing token to addressform before it got created */}
          {/* for first we check that if we have the token then only  render the Form component */}
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
