'use server'

import { backendClient } from "@/sanity/lib/backendClient";

export async function toggleWishlistAction(userId: string, productId: string, isInWishlist: boolean) {
  try {
    // 1. Ensure the user document exists before patching
    await backendClient.createIfNotExists({
        _id: userId,
        _type: 'user',
        wishlist: []
    });

    if (isInWishlist) {
        // REMOVE from Wishlist
        await backendClient
          .patch(userId)
          .unset([`wishlist[_ref=="${productId}"]`])
          .commit();
      } else {
        // ADD to Wishlist
        await backendClient
          .patch(userId)
          .setIfMissing({ wishlist: [] })
          .append("wishlist", [{ _type: "reference", _ref: productId, _key: productId }])
          .commit();
      }
      
      return { success: true };
  } catch (error) {
    console.error("Sanity Write Error:", error);
    return { success: false, error: "Failed to update wishlist" };
  }
}