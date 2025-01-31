"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeCartItemAction } from "../../actions/cart";

interface RemoveFromCartButtonProps {
    cartItemId: string;
}

export default function RemoveFromCartButton({ cartItemId }: RemoveFromCartButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleRemove = () => {
        startTransition(async () => {
            await removeCartItemAction(cartItemId);
            router.refresh(); // Refresh the cart page
        });
    };

    return (
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRemove}
            disabled={isPending}
        >
            {isPending ? "Removing..." : "Remove"}
        </button>
    );
}
