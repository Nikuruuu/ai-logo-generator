"use client";

import { UserDetailContext } from "@/app/_context/UserDetailContext";
import Image from "next/image";
import React, { useContext } from "react";
import Link from "next/link";
import AiButton from "@/components/animata/button/ai-button";
import coinImage from "@/public/coin.png";
function Info() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const firstName = userDetail?.name ? userDetail.name.split(" ")[0] : "";

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <h2 className="font-bold text-2xl sm:text-3xl text-brand-primary text-center sm:text-left">
          Hello, {firstName}!
        </h2>
        <div className="flex items-center gap-2">
          <Image src={coinImage} alt="coin" width={40} height={40} priority />
          <h2 className="font-bold text-xl sm:text-2xl">
            {userDetail?.credits} Credits
          </h2>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <h2 className="font-bold text-2xl text-brand-primary">Dashboard</h2>
        <Link href="/create">
          <AiButton>Create new logo</AiButton>
        </Link>
      </div>
    </div>
  );
}

export default Info;
