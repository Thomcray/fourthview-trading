// components/UserImage.tsx
"use client";

import Image from "next/image";
import { User } from "lucide-react";

interface UserImageProps {
  nameInitial?: string;
  session: any;
  width?: string;
  height?: string;
  imageUrl?: string;
}

export default function UserImage({
  nameInitial,
  session,
  width = "w-40",
  height = "h-40",
  imageUrl,
}: UserImageProps) {
  const userImage = imageUrl || session?.user?.image;
  const initial = nameInitial || session?.user?.firstName?.charAt(0) || "?";

  return (
    <div className={`relative ${width} ${height}`}>
      <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
        {userImage ? (
          <Image
            src={userImage}
            alt="User avatar"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 96px, 160px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-1/2 h-1/2 text-blue-400" />
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
    </div>
  );
}
