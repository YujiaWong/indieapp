import React from "react";
import { Input } from "@nextui-org/input";

export default function SigninByEmail() {
  return (
    <div className="flex justify-center items-center flex-wrap bg-black">
      <Input
        type="email"
        variant="bordered"
        placeholder="name@example.com"
        className="rounded w-[280px] h-7 mt-4 border-gray-300 "
      />

      <Input
        type="password"
        variant="bordered"
        placeholder="Password"
        className="rounded w-[280px] h-7 mt-6 border-gray-300 "
      />
    </div>
  );
}
