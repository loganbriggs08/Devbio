'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  });
}