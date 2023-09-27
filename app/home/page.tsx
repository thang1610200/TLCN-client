"use client";

import React from "react";
import { useSession } from "next-auth/react";

export default function page() {
  const session = useSession();
  return <div>{ session?.data?.user.name }</div>;
}
