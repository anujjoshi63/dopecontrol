"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

const ProfilePicture = ({
  imageURL,
  name,
}: {
  imageURL: string;
  name: string;
}) => {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        aria-label={`${name} profile menu`}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
      >
        <Avatar className="transition-all hover:opacity-80">
          <AvatarImage 
            src={imageURL} 
            alt={`${name} profile picture`}
          />
          <AvatarFallback 
            className="animate-pulse bg-transparent"
            aria-label={`${name} initials`}
          >
            {name.split(' ').map(n => n[0]).join('').toUpperCase() ?? '👤'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        aria-label="User account menu"
      >
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="focus:bg-red-50 focus:text-red-600"
        >
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfilePicture;
