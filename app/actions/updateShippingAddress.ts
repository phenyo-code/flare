import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function updateShippingAddress(formData: FormData): Promise<void> {
    "use server";

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const address = formData.get("address")?.toString();
    const phoneNumber = formData.get("phoneNumber")?.toString();
    const isDefault = formData.get("isDefault") === "on"; // Check if the checkbox is checked

    if (!id || !name || !email || !address || !phoneNumber) {
        console.error("Please fill in all fields.");
        return;
    }

    if (isDefault) {
        // Unset default on all other addresses for the user
        await prisma.shippingAddress.updateMany({
            where: { userId: formData.get("userId")?.toString() }, // Replace with session or form user ID
            data: { isDefault: false },
        });
    }

    // Update the shipping address
    await prisma.shippingAddress.update({
        where: { id },
        data: { name, email, address, phoneNumber, isDefault },
    });

    console.log("Shipping address updated successfully!");


    // Redirect to the success page after the update
    redirect("/success");
}
