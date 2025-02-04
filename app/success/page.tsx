// app/success/page.tsx
export default function SuccessPage() {
    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Success!</h2>
            <p className="text-lg text-gray-700 mb-4">
                Your shipping address has been updated successfully.
            </p>
            <a
                href="/addresses"
                className="mt-4 bg-blue-500 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700"
            >
                Go back to Addresses
            </a>
        </div>
    );
}
