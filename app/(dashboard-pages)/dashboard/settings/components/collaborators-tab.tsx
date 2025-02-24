"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreVertical, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteCollaboratorModal } from "./invite-collaborator-modal";

const collaborators = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    avatar: "https://github.com/shadcn.png",
    initials: "JD",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Admin",
    avatar: null,
    initials: "SS",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Member",
    avatar: null,
    initials: "MJ",
  },
];

export function CollaboratorsTab() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Collaborators</CardTitle>
        <Button onClick={() => setInviteModalOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Invite
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border divide-y">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={collaborator.avatar || undefined} />
                  <AvatarFallback>{collaborator.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{collaborator.name}</p>
                    {collaborator.role === "Owner" && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {collaborator.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    collaborator.role === "Owner" ? "default" : "secondary"
                  }
                >
                  {collaborator.role}
                </Badge>
                {collaborator.role !== "Owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Roles and Permissions:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <span className="font-medium">Owner</span> - Full access and
              billing management
            </li>
            <li>
              <span className="font-medium">Admin</span> - Can manage invoices
              and collaborators
            </li>
            <li>
              <span className="font-medium">Member</span> - Can create and edit
              invoices
            </li>
          </ul>
        </div>
      </CardContent>
      <InviteCollaboratorModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
    </Card>
  );
}
