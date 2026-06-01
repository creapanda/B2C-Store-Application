import { AdminProductForm } from "../../AdminProductForm";
import { AdminSignIn } from "../../AdminSignIn";
import { isLoggedIn } from "../../../utils/auth";

export default async function Page() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminSignIn />;
  }

  return <AdminProductForm mode="create" />;
}
