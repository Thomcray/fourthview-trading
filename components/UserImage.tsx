import Image from "next/image";
import React from "react";

interface ImageInterface {
  user: { image?: string | null };
}

type ImageType = {
  nameInitial?: string | undefined;
  session: ImageInterface | null;
  width?: string;
  height?: string;
};
export default function UserImage({
  nameInitial,
  session,
  width = "w-40",
  height = "h-40",
}: ImageType) {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${width} ${height} border`}
    >
      {session?.user.image ? (
        <Image
          src={session.user.image}
          alt="user-image"
          width={160}
          height={160}
          className="object-cover"
        />
      ) : (
        <div className="w-full flex justify-center bg-white h-full items-center text-center rounded-full">
          <p className="text-6xl text-blue-900">{nameInitial ?? "?"}</p>
        </div>
      )}
    </div>
  );
}
