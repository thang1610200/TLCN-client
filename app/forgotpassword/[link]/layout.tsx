import React from "react";

export default function layoutResetPassword({
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
