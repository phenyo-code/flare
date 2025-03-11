"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeCartItemAction } from "../../actions/cart";
import { FaTrash, FaSpinner } from "react-icons/fa"; // Import spinner icon
import { RiDeleteBin6Line } from "react-icons/ri";

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
            className="bg-slate-50 border border-slate-200 text-gray-400 p-1 rounded"
            onClick={handleRemove}
            disabled={isPending}
        >
            {isPending ? (
                <FaSpinner className="animate-spin text-gray-400" size={16} />
            ) : (
                <RiDeleteBin6Line size={13} />
            )}
        </button>
    );
}
