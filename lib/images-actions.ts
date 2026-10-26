
"use server";

import "server-only";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

import {
  createUploadUrl as signR2Upload,
  getObjectMetadata,
  deleteR2Object,
  getPublicImageUrl,
} from "./cloudflare/r2";

const MAX_SIZE = 10 * 1024 * 1024;
const WEBP_TYPE = "image/webp";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type ImageRecord = {
  id: string;
  property_id: string;
  storage_path: string;
  file_name: string | null;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at?: string;
  url: string;
};

function fail<T>(error: string): Result<T> {
  console.error("[property-images] Error:", error);
  return { success: false, error };
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function cleanFileName(name: string): string {
  const result = name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return result || "property-image";
}

function validStoragePath(
  path: string,
  propertyId: string,
): boolean {
  return (
    path.startsWith(`properties/${propertyId}/`) &&
    /^properties\/[0-9a-f-]+\/[0-9a-f-]+-[a-zA-Z0-9_-]+\.webp$/i.test(
      path,
    )
  );
}

async function getUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.error("[getUser] Authentication failed:", {
      message: error?.message,
      code: error?.code,
    });

    return null;
  }

  console.log("[getUser] Authenticated user:", data.user.id);

  return data.user;
}

/**
 * Checks that the signed-in user has an admin or agent role.
 *
 * IMPORTANT:
 * Add property ownership/agency checks here if agents should only
 * manage properties assigned to them.
 */
async function canManageProperty(
  userId: string,
  propertyId: string,
): Promise<boolean> {
  console.log("[canManageProperty] Checking:", {
    userId,
    propertyId,
  });

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("[canManageProperty] Profile query failed:", {
      code: profileError.code,
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
    });

    return false;
  }

  if (!profile) {
    console.error(
      "[canManageProperty] No profile found for user:",
      userId,
    );

    return false;
  }

  const role = profile.role;
  const roleAllowed = role === "admin" || role === "agent";

  console.log("[canManageProperty] Role check:", {
    role,
    roleAllowed,
  });

  if (!roleAllowed) {
    return false;
  }

  // Verify the property exists and is visible to this user.
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .maybeSingle();

  if (propertyError) {
    console.error("[canManageProperty] Property query failed:", {
      code: propertyError.code,
      message: propertyError.message,
      details: propertyError.details,
      hint: propertyError.hint,
    });

    return false;
  }

  if (!property) {
    console.error(
      "[canManageProperty] Property not found or not accessible:",
      propertyId,
    );

    return false;
  }

  console.log("[canManageProperty] Permission check passed.");

  return true;
}

/**
 * Creates a temporary signed URL for uploading a WebP image to R2.
 */
export async function createPropertyImageUploadUrl(input: {
  propertyId: string;
  fileName: string;
  contentType: string;
  size: number;
}): Promise<Result<{ uploadUrl: string; storagePath: string }>> {
  try {
    console.log("[createPropertyImageUploadUrl] Started:", {
      propertyId: input.propertyId,
      fileName: input.fileName,
      contentType: input.contentType,
      size: input.size,
    });

    const user = await getUser();

    if (!user) {
      return fail("Please sign in.");
    }

    if (!isUuid(input.propertyId)) {
      return fail("Invalid property ID.");
    }

    if (
      typeof input.fileName !== "string" ||
      !input.fileName.trim() ||
      input.fileName.length > 255
    ) {
      return fail("Invalid image filename.");
    }

    if (
      !(await canManageProperty(user.id, input.propertyId))
    ) {
      return fail("You cannot edit this property.");
    }

    if (input.contentType !== WEBP_TYPE) {
      return fail("Only WebP images are accepted.");
    }

    if (
      !Number.isFinite(input.size) ||
      input.size <= 0 ||
      input.size > MAX_SIZE
    ) {
      return fail(
        "The compressed image must be 10 MB or smaller.",
      );
    }

    const fileName = cleanFileName(input.fileName);

    const storagePath =
      `properties/${input.propertyId}/${randomUUID()}-${fileName}.webp`;

    const uploadUrl = await signR2Upload(storagePath);

    console.log("[createPropertyImageUploadUrl] Signed URL created:", {
      propertyId: input.propertyId,
      storagePath,
    });

    return {
      success: true,
      data: { uploadUrl, storagePath },
    };
  } catch (error) {
    console.error(
      "[createPropertyImageUploadUrl] Failed:",
      error,
    );

    return fail("Could not prepare the upload.");
  }
}

/**
 * Verifies the uploaded R2 object and saves its database record.
 */
export async function completePropertyImageUpload(input: {
  propertyId: string;
  storagePath: string;
  fileName: string;
  altText?: string;
}): Promise<Result<ImageRecord>> {
  try {
    console.log("[completePropertyImageUpload] Started:", {
      propertyId: input.propertyId,
      storagePath: input.storagePath,
      fileName: input.fileName,
    });

    const user = await getUser();

    if (!user) {
      return fail("Please sign in.");
    }

    if (
      !isUuid(input.propertyId) ||
      !validStoragePath(input.storagePath, input.propertyId)
    ) {
      console.error("[completePropertyImageUpload] Invalid input:", {
        propertyId: input.propertyId,
        storagePath: input.storagePath,
      });

      return fail("Invalid property or image path.");
    }

    if (
      typeof input.fileName !== "string" ||
      !input.fileName.trim() ||
      input.fileName.length > 255
    ) {
      return fail("Invalid image filename.");
    }

    if (
      input.altText !== undefined &&
      typeof input.altText !== "string"
    ) {
      return fail("Invalid image alt text.");
    }

    if (
      !(await canManageProperty(user.id, input.propertyId))
    ) {
      return fail("You cannot edit this property.");
    }

    // Verify the uploaded object in Cloudflare R2.
    const object = await getObjectMetadata(input.storagePath);

    console.log("[completePropertyImageUpload] R2 metadata:", {
      contentType: object.ContentType,
      contentLength: object.ContentLength,
    });

    if (
      object.ContentType !== WEBP_TYPE ||
      typeof object.ContentLength !== "number" ||
      object.ContentLength <= 0 ||
      object.ContentLength > MAX_SIZE
    ) {
      return fail("The uploaded object failed validation.");
    }

    // Use the authenticated Supabase client for database queries.
    const supabase = await createClient();

    // Make completion retries safe.
    const { data: existing, error: existingError } = await supabase
      .from("property_images")
      .select("*")
      .eq("storage_path", input.storagePath)
      .maybeSingle();

    if (existingError) {
      console.error(
        "[completePropertyImageUpload] Existing image query failed:",
        {
          code: existingError.code,
          message: existingError.message,
          details: existingError.details,
          hint: existingError.hint,
        },
      );

      return fail(
        `Could not check existing image: ${existingError.message}`,
      );
    }

    if (existing) {
      if (existing.property_id !== input.propertyId) {
        return fail("Image path belongs to another property.");
      }

      console.log(
        "[completePropertyImageUpload] Image already recorded:",
        existing.id,
      );

      return {
        success: true,
        data: {
          ...existing,
          url: getPublicImageUrl(existing.storage_path),
        } as ImageRecord,
      };
    }

    // Count existing images for this property.
    const { count, error: countError } = await supabase
      .from("property_images")
      .select("id", { count: "exact", head: true })
      .eq("property_id", input.propertyId);

    if (countError) {
      console.error(
        "[completePropertyImageUpload] Count query failed:",
        {
          propertyId: input.propertyId,
          code: countError.code,
          message: countError.message,
          details: countError.details,
          hint: countError.hint,
        },
      );

      return fail(
        `Could not prepare the image record: ${countError.message}`,
      );
    }

    console.log("[completePropertyImageUpload] Image count:", count);

    const isFirst = (count ?? 0) === 0;

    const insertPayload = {
      property_id: input.propertyId,
      storage_path: input.storagePath,
      file_name: `${cleanFileName(input.fileName)}.webp`,
      alt_text: input.altText?.slice(0, 250) ?? null,
      display_order: count ?? 0,
      is_primary: isFirst,
    };

    console.log(
      "[completePropertyImageUpload] Inserting image record:",
      insertPayload,
    );

    const { data: image, error: insertError } = await supabase
      .from("property_images")
      .insert(insertPayload)
      .select("*")
      .single();

    if (insertError || !image) {
      console.error(
        "[completePropertyImageUpload] Insert failed:",
        {
          propertyId: input.propertyId,
          code: insertError?.code,
          message: insertError?.message,
          details: insertError?.details,
          hint: insertError?.hint,
          hasImage: Boolean(image),
        },
      );

      return fail(
        `Upload succeeded, but saving its record failed: ${
          insertError?.message ?? "No image record returned."
        }`,
      );
    }

    console.log(
      "[completePropertyImageUpload] Image record saved:",
      image.id,
    );

    return {
      success: true,
      data: {
        ...image,
        url: getPublicImageUrl(image.storage_path),
      } as ImageRecord,
    };
  } catch (error) {
    console.error(
      "[completePropertyImageUpload] Unexpected failure:",
      error,
    );

    return fail("Could not complete the upload.");
  }
}

/**
 * Loads saved images for the property editor.
 */
export async function getPropertyImages(
  propertyId: string,
): Promise<Result<ImageRecord[]>> {
  try {
    console.log("[getPropertyImages] Started:", { propertyId });

    const user = await getUser();

    if (!user) {
      return fail("Please sign in.");
    }

    if (!isUuid(propertyId)) {
      return fail("Invalid property ID.");
    }

    if (!(await canManageProperty(user.id, propertyId))) {
      return fail("You cannot view these images.");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", propertyId)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[getPropertyImages] Query failed:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      return fail(
        `Could not load property images: ${error.message}`,
      );
    }

    console.log(
      "[getPropertyImages] Images loaded:",
      data?.length ?? 0,
    );

    return {
      success: true,
      data: (data ?? []).map((image) => ({
        ...image,
        url: getPublicImageUrl(image.storage_path),
      })) as ImageRecord[],
    };
  } catch (error) {
    console.error("[getPropertyImages] Unexpected failure:", error);

    return fail("Could not load property images.");
  }
}

/**
 * Deletes an image from R2 and then removes its database record.
 */
export async function deletePropertyImage(input: {
  propertyId: string;
  imageId: string;
}): Promise<Result<null>> {
  try {
    console.log("[deletePropertyImage] Started:", input);

    const user = await getUser();

    if (!user) {
      return fail("Please sign in.");
    }

    if (
      !isUuid(input.propertyId) ||
      !isUuid(input.imageId)
    ) {
      return fail("Invalid property or image ID.");
    }

    if (!(await canManageProperty(user.id, input.propertyId))) {
      return fail("You cannot delete this image.");
    }

    const supabase = await createClient();

    const { data: image, error: lookupError } = await supabase
      .from("property_images")
      .select("*")
      .eq("id", input.imageId)
      .eq("property_id", input.propertyId)
      .maybeSingle();

    if (lookupError) {
      console.error("[deletePropertyImage] Lookup failed:", {
        code: lookupError.code,
        message: lookupError.message,
        details: lookupError.details,
        hint: lookupError.hint,
      });

      return fail(
        `Could not find image record: ${lookupError.message}`,
      );
    }

    if (!image) {
      return fail("Image not found.");
    }

    if (!validStoragePath(image.storage_path, input.propertyId)) {
      return fail("Invalid stored image path.");
    }

    // Delete the R2 object first.
    await deleteR2Object(image.storage_path);

    console.log(
      "[deletePropertyImage] R2 object deleted:",
      image.storage_path,
    );

    // Delete the database record using the authenticated session.
    const { data: deleted, error: deleteError } = await supabase
      .from("property_images")
      .delete()
      .eq("id", image.id)
      .eq("property_id", input.propertyId)
      .select("id");

    if (deleteError) {
      console.error("[deletePropertyImage] Database delete failed:", {
        code: deleteError.code,
        message: deleteError.message,
        details: deleteError.details,
        hint: deleteError.hint,
      });

      return fail(
        `The file was deleted, but its database record remains: ${deleteError.message}`,
      );
    }

    if (!deleted || deleted.length === 0) {
      console.error(
        "[deletePropertyImage] No database record was deleted. Check DELETE RLS policies.",
      );

      return fail(
        "The file was deleted, but the database record remains. Check your DELETE policy.",
      );
    }

    console.log(
      "[deletePropertyImage] Database record deleted:",
      image.id,
    );

    // If the deleted image was primary, promote the next image.
    if (image.is_primary) {
      const { data: next, error: nextError } = await supabase
        .from("property_images")
        .select("id")
        .eq("property_id", input.propertyId)
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (nextError) {
        console.error(
          "[deletePropertyImage] Next image lookup failed:",
          nextError,
        );
      } else if (next) {
        const { error: promoteError } = await supabase
          .from("property_images")
          .update({ is_primary: true })
          .eq("id", next.id)
          .eq("property_id", input.propertyId);

        if (promoteError) {
          console.error(
            "[deletePropertyImage] Primary image promotion failed:",
            promoteError,
          );
        } else {
          console.log(
            "[deletePropertyImage] New primary image:",
            next.id,
          );
        }
      }
    }

    return { success: true, data: null };
  } catch (error) {
    console.error("[deletePropertyImage] Unexpected failure:", error);

    return fail("Could not delete the image.");
  }
}
