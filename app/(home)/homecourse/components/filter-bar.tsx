import React from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronsUpDown , Check } from 'lucide-react';




const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]


export default function FilterBar({ className }: React.HTMLAttributes<HTMLDivElement>) {

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 ">
        <div className="px-3 ">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between rounded-3xl"
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)?.label
                  : "Select framework..."}
                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 rounded-lg">
              <Command>
                <CommandInput placeholder="Search framework..." className="h-9" />
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      {framework.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === framework.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="px-3 ">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            License
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                All
              </label>
            </div>

            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Premium
              </label>
            </div>
            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Free
              </label>
            </div>
          </div>
        </div>
        <div className="px-3 ">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            Skill
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Beginner
              </label>
            </div>

            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Intermideate
              </label>
            </div>
            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Advanced
              </label>
            </div>
          </div>
        </div>
        <div className="px-3 ">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            Time
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {">30m"}
              </label>
            </div>

            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {"30m-60m"}
              </label>
            </div>
            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {"<60m"}
              </label>
            </div>
          </div>
        </div>
        <div className="px-3 ">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            Language
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                All
              </label>
            </div>

            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Vietnamese
              </label>
            </div>
            <div className="flex items-center justify-start w-full px-4 space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                English
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
