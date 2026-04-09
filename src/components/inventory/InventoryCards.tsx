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
        <div className={`grid grid-cols-1 ${isInactiveView ? '' : 'md:grid-cols-4'} gap-4`}>
            
            <div className={`bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 ${isInactiveView ? 'border-slate-300' : 'border-blue-200'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isInactiveView ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                    <i className={`bi ${isInactiveView ? 'bi-trash3' : 'bi-box-seam'}`}></i>
                </div>
                <div>
                    <p className={`text-sm font-medium ${isInactiveView ? 'text-slate-600' : 'text-blue-700'}`}>
                        {isInactiveView ? 'Total Inactivos' : 'Total Productos'}
                    </p>
                    <p className={`text-2xl font-black ${isInactiveView ? 'text-slate-800' : 'text-blue-800'}`}>
                        {stats.totalItems}
                    </p>
                </div>
            </div>

            {!isInactiveView && (
                <>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
                            <i className="bi bi-currency-dollar"></i>
                        </div>
                        <div>
                            <p className="text-sm text-green-700 font-medium">Capital invertido</p>
                            <p className="text-2xl font-black text-green-900">
                                ${stats.totalValue.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">
                            <i className="bi bi-exclamation-triangle"></i>
                        </div>
                        <div>
                            <p className="text-sm text-yellow-700 font-medium">Stock Bajo</p>
                            <p className="text-2xl font-black text-yellow-700">
                                {stats.lowStock}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl">
                            <i className="bi bi-x-circle"></i>
                        </div>
                        <div>
                            <p className="text-sm text-red-700 font-medium">Agotados</p>
                            <p className="text-2xl font-black text-red-700">
                                {stats.outOfStock}  
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}