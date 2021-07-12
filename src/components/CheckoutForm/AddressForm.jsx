import React, { useState, useEffect } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { commerce } from "../../lib/commerce";

import FormInput from "./FormInput";
// import { Restaurant } from "@material-ui/icons";

const AddressForm = ({ checkoutToken, next }) => {
  // all the countries
  const [shippingCountries, setShippingCountries] = useState([]);
  // only chosen one
  const [shippingCountry, setShippingCountry] = useState("");

  // all subdivision
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  // selected one
  const [shippingSubdivision, setShippingSubdivision] = useState("");

  // all Options
  const [shippingOptions, setShippingOptions] = useState([]);
  // selected one
  const [shippingOption, setShippingOption] = useState("");

  const methods = useForm();

  // this is our checkout tokken that we get from commerce API
  const fetchShippingCountries = async (checkoutTokenId) => {
    // countries = response.countries
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );

    // console.log(response.countries);
    setShippingCountries(countries);

    // here we're saving the Country instead of Countries
    // Now that we've all countries we can loop through them, but that is a problem.
    // as we can see by loging the countries that countries are saved in "Object" not in "array"
    // that means we can't loop through them, and we can't use somthing like "countries.IN" (IN- India) because we dont know how many countries are there

    // So what we can do is We can ask for Countries Keys which is "AU, IN, US, etc" these are represendet in object as {AU: "Australia", US: "United States", IN: "India"}
    // by doing that we get an array of these keys as [AU, US, IN]
    // and in that give as the first key because as default we want first country to be selected
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivisions = async (countryCode) => {
    // subdivisions = response.subdivisions
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );

    setShippingSubdivisions(subdivisions);

    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    region = null
  ) => {
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country, region }
    );

    setShippingOptions(options);
    // console.log(options);

    setShippingOption(options[0].id);
  };

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  // we can not call fetchSubdivisions in above useEffect because at time we won't have country
  //  so we use another useEffect
  // and whenever our shippingCountry changes we have to call this useEffect
  useEffect(() => {
    if (shippingCountry) {
      fetchSubdivisions(shippingCountry);
    }
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision) {
      fetchShippingOptions(
        checkoutToken.id,
        shippingCountry,
        shippingSubdivision
      );
    }
  }, [shippingSubdivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      {/* ...methods is used to spred all methods */}
      <FormProvider {...methods}>
        {/* here we spred the data(...data) because we want to send the whole data not just names and zip code we also want to send the country, sub and option and that can be done using ...data */}
        {/* we also pass shipping Country, subdivision and option so we call pass these value to next page i.e paymentPage */}
        <form
          onSubmit={methods.handleSubmit((data) =>
            next({
              ...data,
              shippingCountry,
              shippingSubdivision,
              shippingOption,
            })
          )}
        >
          <Grid container spacing={3}>
            <FormInput required name="firstName" label="First Name" />
            <FormInput required name="lastName" label="Last Name" />
            <FormInput required name="address" label="Address" />
            <FormInput required name="email" label="Email" />
            <FormInput required name="city" label="City" />
            <FormInput required name="zip" label="ZIP Code" />

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              {/* here on change we want to set the shipping country to the value that is selected */}
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => setShippingCountry(e.target.value)}
              >
                {/* here we can't use map because its not an array its an object, So we use Object.entries */}
                {/* Object.entries gives as keys and values of object, in our case that is AU: "Australia" etc */}
                {/* now here we have array of arrays because shippingCountries is an array and in it all countries are in array which contains key and value(i.e country name)*/}

                {/* to understand it more clearly uncomment the below line and log the reponse */}
                {/* {console.log(Object.entries(shippingCountries))} */}

                {/* we destructure the response of every country that has two value the key and name of country */}
                {/* to understand all of this just console.log every thing */}
                {Object.entries(shippingCountries)
                  .map(([code, name]) => ({ id: code, label: name }))
                  .map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.label}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select
                value={shippingSubdivision}
                fullWidth
                onChange={(e) => setShippingSubdivision(e.target.value)}
              >
                {Object.entries(shippingSubdivisions)
                  .map(([code, name]) => ({ id: code, label: name }))
                  .map((subdivision) => (
                    <MenuItem key={subdivision.id} value={subdivision.id}>
                      {subdivision.label}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select
                value={shippingOption}
                fullWidth
                onChange={(e) => setShippingOption(e.target.value)}
              >
                {shippingOptions
                  .map((sO) => ({
                    id: sO.id,
                    label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
                  }))
                  .map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button component={Link} to="/cart" variant="outlined">
              Back to Cart
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {" "}
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
