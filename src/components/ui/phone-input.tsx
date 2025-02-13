import { CheckIcon, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import * as RPNInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { InputProps } from "@/components/ui/input"

// Rename to follow PascalCase convention
const RPNInputDefault = RPNInput.default

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> &
  Omit<RPNInput.Props<typeof RPNInputDefault>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void
  }

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
  React.ElementRef<typeof RPNInputDefault>,
  PhoneInputProps
>(({ className, onChange, ...props }, ref) => {
  return (
    <RPNInputDefault
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      onChange={value => onChange?.(value ?? ("" as RPNInput.Value))}
      {...props}
    />
  )
})
PhoneInput.displayName = "PhoneInput"

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input className={cn("rtl:rtl rounded-s-none rounded-e-lg", className)} {...props} ref={ref} />
  ),
)
InputComponent.displayName = "InputComponent"

type CountrySelectOption = { label: string; value: RPNInput.Country }

type CountrySelectProps = {
  disabled?: boolean
  value: RPNInput.Country
  onChange: (value: RPNInput.Country) => void
  options: CountrySelectOption[]
}

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country)
    },
    [onChange],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex cursor-pointer gap-1.5 rounded-s-lg rounded-e-none")}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn("h-4 w-4 opacity-50", disabled ? "hidden" : "opacity-100")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="absolute left-8 w-80 p-0" align="center">
        <Command>
          <CommandInput placeholder="إبحث عن الدولة..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>لم يتم إيجاد نتيجة.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter(x => x.value)
                  .map(option => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent country={option.value} countryName={option.label} />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-sm">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="bg-foreground/15 h-4 w-4 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}
FlagComponent.displayName = "FlagComponent"

export { PhoneInput }
