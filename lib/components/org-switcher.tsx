"use client";

import * as React from "react";
import { ChevronDown, Check, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils/utilities";
import { Button } from "./ui/button";
import { Badge } from "@/lib/components/ui/badge";
import Cookies from "js-cookie";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Organization } from "@/lib/types";
import { useRefreshStore } from "../stores/use-refresh-store";
import { limitCharacters } from "@/lib/utils/utilities";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OrgSwitcherProps {
  className?: string;
  organizations: Organization[];
}

export function OrgSwitcher({ className, organizations }: OrgSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  let activeOrgUuid = Cookies.get("activeOrgUuid") || null;
  const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
  let selectedOrg =
    organizations.find((org) => org.uuid === activeOrgUuid) || null;

  if (organizations.length === 0 || !selectedOrg) {
    return (
      <Button
        variant="outline"
        className={cn("w-52 justify-between", className)}
        onClick={() => {
          router.push("/create-org");
        }}
      >
        New Organization
        <PlusCircle className="mr-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select organization"
          className={cn("w-52 justify-between", className)}
        >
          {limitCharacters(selectedOrg?.name, 12) || "Select organization"}
          <Badge variant="outline" className="ml-2">
            {selectedOrg.currency}
          </Badge>
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Organizations">
              {organizations.map((org) => (
                <CommandItem
                  key={org.uuid}
                  onSelect={() => {
                    Cookies.set("activeOrgUuid", org.uuid);
                    triggerRefresh();
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  {limitCharacters(org.name, 12)}
                  <Badge variant="outline" className="ml-2">
                    {org.currency}
                  </Badge>

                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      activeOrgUuid === org.uuid ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                className="cursor-pointer"
                onSelect={() => {
                  setOpen(false);
                  router.push("/create-org");
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
