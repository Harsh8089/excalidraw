"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/config";
import { signInSchema } from "@repo/common/types";
import { useRouter } from "next/navigation";

const SignIn: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loader, setLoader] = useState<boolean>(false);

  const router = useRouter();
  
  return <div>
    {
      loader ? (
        <div>Signing In</div>
      ) : (
        <>
          <input 
            type="text" 
            placeholder="username"
            ref={usernameRef}
          />
          <input 
            type="password" 
            placeholder="password"
            ref={passwordRef}
          />
          <button
            onClick={async () => {
              setLoader(true);
              if(usernameRef && passwordRef) {
                const parsedData = signInSchema.safeParse({
                  username: usernameRef.current?.value,
                  password: passwordRef.current?.value
                })
                if(parsedData.success) {
                  const res = await axios.post(`${BACKEND_URL}/sign-in`, parsedData.data);
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("userId", res.data.userId);
                }
                else console.log(parsedData.error)
              }
              setLoader(false);
              router.replace("/room");
            }}
          >
            Sign In
          </button>
        </>
      )
    }
  </div>
}

export default SignIn;
