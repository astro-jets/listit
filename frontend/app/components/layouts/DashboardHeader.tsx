const DashboardHeader = () => {
    return (

        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h2 className="text-xl font-bold">User Dashboard</h2>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold leading-none">Jordan Smith</p>
                    <p className="text-xs text-gray-500">Pro Member</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-black border-2 border-yellow-400" />
            </div>
        </header>
    );
}

export default DashboardHeader;