"use client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function HeroVideoDialog({
  animationStyle = "from-center",
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}) {
  const router = useRouter();

  const handleThumbnailClick = () => {
    // Navigate to the /Maps page
    router.push("/Maps");
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className="group relative cursor-pointer"
        onClick={handleThumbnailClick}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
        />
      </div>
    </div>
  );
}
