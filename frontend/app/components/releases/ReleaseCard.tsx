import StatusBadge from "./StatusBadge";

export default function ReleaseCard({ release }: { release: any }) {
    return (
        <div className="border p-4 rounded mb-4">
            <h3 className="font-bold text-lg">{release.title}</h3>
            <p className="text-sm text-gray-600">{release.genre}</p>
            <StatusBadge status={release.status} />
        </div>
    );
}
