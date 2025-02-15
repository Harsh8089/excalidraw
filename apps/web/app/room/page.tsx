"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createRoomSchema } from "@repo/common/types"

const Room: React.FC = () => {
  const slugRef = useRef<HTMLInputElement>(null);
  const [loader, setLoader] = useState<boolean>(false);

  const router = useRouter();

  return <div>
    {
      loader ? (
        <div>Connecting to ws ...</div>
      ) : (
        <div>
          <input 
            type="text"
            placeholder="enter slug"
            ref={slugRef}
          />
          <button
            onClick={async () => {
              setLoader(true);
              const slugobj = {
                slug: slugRef.current?.value
              }
              const parsedData = createRoomSchema.safeParse(slugobj);
              if(parsedData.success) {
                router.push(`/room/${parsedData.data.slug}`)
              } else {
                console.log(parsedData.error);
              }
              setLoader(false);
            }}
          >
            Join
          </button>
        </div>
      ) 
    }
  </div>
};

export default Room;