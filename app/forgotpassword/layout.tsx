import React from "react";

export default function layoutRegister({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <body>{children}</body>
    </>
  );
}
