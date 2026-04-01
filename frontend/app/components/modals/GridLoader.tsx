const GridLoader = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="h-64 bg-zinc-900 animate-pulse rounded-xl"
                />
            ))}
        </div>
    );
}

export default GridLoader;