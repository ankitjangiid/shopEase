// this is basically FromInputs
//  here we use react-hook-form to simplify our work
// react-hook-form is used to reduce our code
// basically when we want the user input we've to use 'useState' for different field but here react-hook-form is doing this for us

import React from "react";
import { TextField, Grid } from "@material-ui/core";
import { useFormContext, Controller } from "react-hook-form";

const FormInput = ({ name, label, required }) => {
  const { control } = useFormContext();

  return (
    <Grid item xs={12} sm={6}>
      <Controller
        as={TextField}
        defaultValue=""
        control={control}
        fullWidth
        name={name}
        label={label}
        required={required}
      />
    </Grid>
  );
};

export default FormInput;
