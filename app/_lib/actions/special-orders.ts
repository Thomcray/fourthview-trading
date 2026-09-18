"use server";

import { newSpecialOrders, updateSpecialOrderImages } from "../data-services";
import { uploadProductImage } from "./upload-actions";

const SPECIAL_ORDER_DEPOSIT = 50_000;

export async function specialOrders(
  formData: FormData,
  userId: string | undefined,
  orderImages: File[],
  paymentReference: string,
) {
  const email = formData.get("email") as string;
  const description = formData.get("description") as string;
  const whatsapp = formData.get("whatsapp") as string;

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!email) {
    throw new Error("User email not found!");
  }

  if (!whatsapp) {
    throw new Error("WhatsApp number is required");
  }

  if (!description?.trim()) {
    throw new Error("Order description is required");
  }

  if (!paymentReference) {
    throw new Error("Payment reference is required");
  }

  // ------------------------------------------------------------
  // Verify the ₦50,000 deposit directly with Paystack
  // ------------------------------------------------------------

  const paystackResponse = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(
      paymentReference,
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  const paystackResult = await paystackResponse.json();

  if (!paystackResponse.ok || !paystackResult.status) {
    console.error(
      "Special-order Paystack verification failed:",
      paystackResult,
    );

    throw new Error("Unable to verify the ₦50,000 deposit.");
  }

  const transaction = paystackResult.data;

  // ------------------------------------------------------------
  // Validate payment
  // ------------------------------------------------------------

  const expectedAmount = SPECIAL_ORDER_DEPOSIT * 100;

  if (transaction.status !== "success") {
    throw new Error(
      `Payment was not successful. Status: ${transaction.status}`,
    );
  }

  if (transaction.amount !== expectedAmount) {
    console.error("Invalid special-order deposit amount:", {
      expected: expectedAmount,
      received: transaction.amount,
      reference: paymentReference,
    });

    throw new Error("Invalid special-order deposit amount.");
  }

  if (transaction.currency !== "NGN") {
    throw new Error("Invalid payment currency.");
  }

  // ------------------------------------------------------------
  // Create special order first
  // ------------------------------------------------------------

  const specialOrder = await newSpecialOrders({
    email,
    description,
    userId,
    images: [],
    whatsapp,
    deposit_amount: SPECIAL_ORDER_DEPOSIT,
    deposit_reference: transaction.reference,
    deposit_status: "paid",
    deposit_paid_at: transaction.paid_at ?? new Date().toISOString(),
  });

  if (!specialOrder?.id) {
    throw new Error(
      "Payment was verified, but the special order could not be created.",
    );
  }

  // ------------------------------------------------------------
  // Upload reference images
  // ------------------------------------------------------------

  const uploadedImageUrls: string[] = [];

  try {
    for (const file of orderImages) {
      if (!file.type.startsWith("image/")) {
        throw new Error(`Invalid file type: ${file.name} must be an image`);
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`Image ${file.name} must be less than 5MB.`);
      }

      const fileURL = await uploadProductImage(file);

      if (fileURL) {
        uploadedImageUrls.push(fileURL);
      }
    }

    if (uploadedImageUrls.length > 0) {
      await updateSpecialOrderImages(specialOrder.id, uploadedImageUrls);
    }
  } catch (error) {
    console.error("Special order image upload failed:", error);

    throw new Error(
      "Your payment was successful and your special order was created, but there was a problem uploading the reference images. Please contact us.",
    );
  }

  return {
    success: true,
    specialOrderId: specialOrder.id,
    depositReference: transaction.reference,
  };
}
