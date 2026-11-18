import { redirect } from "react-router";

export function loader() {
  return redirect("/join");
}

export default function RegisterRedirect() {
  return null;
}
