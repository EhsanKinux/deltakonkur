import { FormControl, FormField, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const CustomRegInput = ({control, name, label}) => {
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <div className="form-item">
        {/* <FormLabel>{label}</FormLabel> */}
        <div className="flex w-full flex-col">
          <FormControl>
            <Input
              id={name}
              className="input-class"
              placeholder={label}
              type={name === "password" ? "password" : "text"}
              {...field}
            />
          </FormControl>
          <FormMessage className="form-message mt-2" />
        </div>
      </div>
    )}
  />
  )
}

export default CustomRegInput