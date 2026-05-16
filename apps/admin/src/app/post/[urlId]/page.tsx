import { getPostByUrlId } from "@repo/db/client";
import { AdminPostForm } from "../../AdminPostForm";
import { AdminSignIn } from "../../AdminSignIn";
import { isLoggedIn } from "../../../utils/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminSignIn />;
  }

  const { urlId } = await params;
  const post = await getPostByUrlId(urlId);

  if (!post) {
    return <main>Post not found</main>;
  }

  return <AdminPostForm mode="update" post={post} />;
}
