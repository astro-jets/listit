export default function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        DRAFT: "bg-gray-500",
        PROCESSING: "bg-yellow-500",
        PENDING_REVIEW: "bg-blue-500",
        PUBLISHED: "bg-green-600",
        REJECTED: "bg-red-600",
    };

    return (
        <span className={`text-white px-2 py-1 rounded ${colors[status]}`}>
            {status}
        </span>
    );
}
