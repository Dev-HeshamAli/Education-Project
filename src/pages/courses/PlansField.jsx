import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { Controller, useFieldArray } from "react-hook-form";
import { Add } from "@mui/icons-material";

const PlansField = ({ control, errors, options }) => {
  const { fields, append } = useFieldArray({
    control,
    name: "plans", // ده لازم يطابق اسم الـ field اللي هيبعت Array
  });

  return (
    <Box>
      <Typography variant="subtitle1" mb={1}>
        Plans
      </Typography>
      {fields.map((field, index) => (
        <FormControl
          key={field.id}
          fullWidth
          margin="normal"
          error={!!errors?.plans?.[index]}
        >
          <InputLabel>Plan</InputLabel>
          <Controller
            name={`plans.${index}`} // علشان يبقى Array
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field}>
                <MenuItem value="">
                  <em>Select Plan</em>
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors?.plans?.[index] && (
            <Typography color="error" variant="caption">
              {errors.plans[index].message}
            </Typography>
          )}
        </FormControl>
      ))}

      {/* زرار + لإضافة Plan جديد */}
      <IconButton
        color="primary"
        onClick={() => append("")} // يضيف Plan فاضي
        sx={{ mt: 1 }}
      >
        <Add />
      </IconButton>
    </Box>
  );
};

export default PlansField;