"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils/utilities";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateClientModal } from "./create-client-modal";
import { Client } from "@/lib/types";
import { Organization } from "@/lib/types";
interface ClientSelectorProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
}

export function ClientSelector({
  clients,
  onClientSelect,
}: ClientSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");

  const filteredClients = React.useMemo(() => {
    if (!search) return clients;
    const searchLower = search.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchLower) ||
        client.companyName?.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const selectedClient = React.useMemo(
    () => clients.find((client) => client.id.toString() === value),
    [value]
  );

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      setValue(currentValue);
      const client = clients.find((c) => c.id.toString() === currentValue);
      if (client) {
        onClientSelect(client);
      }
      setOpen(false);
    },
    [onClientSelect]
  );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a client"
            className="w-full justify-between font-normal"
          >
            {selectedClient ? (
              <span className="flex items-center">
                <span className="font-medium">{selectedClient.name}</span>
                <span className="ml-2 text-muted-foreground">
                  ({selectedClient.companyName})
                </span>
              </span>
            ) : (
              "Select a client..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search clients..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No clients found.</CommandEmpty>
              <CommandGroup heading="Clients">
                {filteredClients.map((client) => (
                  <CommandItem
                    key={client.id}
                    value={client.id.toString()}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === client.id.toString()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{client.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {client.companyName}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setCreateModalOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Client
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateClientModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={(client) => {
          // TODO: Add client to the list
          setValue(client.id.toString());
          onClientSelect(client);
        }}
      />
    </>
  );
}
