import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";

import useStyles from "./navbarStyles";

const Navbar = ({ totalItems }) => {
  const classes = useStyles();

  // 'useLocation' is used to tell the current location of page
  const location = useLocation();

  return (
    <div>
      <AppBar position="fixed" className={classes.addBar} color="inherit">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            className={classes.title}
            color="inherit"
          >
            <img
              src="Logo.png"
              alt="shopEase"
              height="40px"
              className={classes.image}
            />
            shopEase
          </Typography>

          <div className={classes.grow} />

          {/* logic to check if we're currently on '/cart' route or not */}
          {/* if this is true then only do this */}
          {location.pathname === "/" && (
            <div className={classes.button}>
              <IconButton
                component={Link}
                to="/cart"
                aria-label="Show cart items"
                color="inherit"
              >
                <Badge badgeContent={totalItems} color="secondary">
                  {/* This is the icon */}
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
