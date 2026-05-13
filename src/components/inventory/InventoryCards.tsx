type InventoryCardsProps = {
    stats: {
        totalItems: number;
        totalValue: number;
        lowStock: number;
        outOfStock: number;
    };
    activeFilter: string; 
}

export default function InventoryCards({ stats, activeFilter }: InventoryCardsProps) {
    const isInactiveView = activeFilter === "INACTIVOS";

    return (
       
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`bg-white p-4 rounded-xl shadow-sm border ${isInactiveView ? 'border-slate-300' : 'border-blue-200'} hover:shadow-md transition-shadow flex items-center gap-4`}>
                <div className={`p-3 rounded-full ${isInactiveView ? 'bg-slate-100' : 'bg-blue-100'}`}>
                    <i className={`bi ${isInactiveView ? 'bi-trash3 text-slate-600' : 'bi-box-seam text-blue-800'} text-xl`}></i>
                </div>
                <div>
                    <p className={`font-medium text-sm ${isInactiveView ? 'text-slate-600' : 'text-blue-700'}`}>
                        {isInactiveView ? 'Total Inactivos' : 'Total Productos'}
                    </p>
                    <p className={`text-2xl font-bold ${isInactiveView ? 'text-slate-800' : 'text-blue-900'}`}>
                        {stats.totalItems}
                    </p>
                </div>
            </div>

            {!isInactiveView && (
                <>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition-shadow flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-100">
                            <i className="bi bi-currency-dollar text-green-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="font-medium text-sm text-green-700">Capital invertido</p>
                            <p className="text-2xl font-bold text-green-900">
                                ${stats.totalValue.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-shadow flex items-center gap-4">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <i className="bi bi-exclamation-triangle text-yellow-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="font-medium text-sm text-yellow-700">Stock Bajo</p>
                            <p className="text-2xl font-bold text-yellow-900">{stats.lowStock}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-shadow flex items-center gap-4">
                        <div className="p-3 rounded-full bg-red-100">
                            <i className="bi bi-x-circle text-red-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="font-medium text-sm text-red-700">Agotados</p>
                            <p className="text-2xl font-bold text-red-900">{stats.outOfStock}</p>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}