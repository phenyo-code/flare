"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeCartItemAction } from "../../actions/cart";
import { FaTrash, FaSpinner } from "react-icons/fa"; // Import spinner icon

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
            className="bg-gray-100 text-gray-400 p-2 rounded"
            onClick={handleRemove}
            disabled={isPending}
        >
            {isPending ? (
                <FaSpinner className="animate-spin text-gray-400" size={16} />
            ) : (
                <FaTrash size={13} />
            )}
        </button>
    );
}
