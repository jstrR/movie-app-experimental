import type { ComponentProps } from "react";
import { EffectorNext } from "@effector/next";
import { fork, serialize } from "effector";

const scope = fork();

export function EffectorAppNext({
  children,
}: ComponentProps<typeof EffectorNext>) {
  const values = serialize(scope);
  return <EffectorNext values={values}>{children}</EffectorNext>;
}
