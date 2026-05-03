interface HeaderSearchProps {
  searchPlaceholder: string; 
  searchTerm: string;
  onSearchChange: (value: string) => void;
  buttonText?: string;
  onAddClick?: () => void;
}
  
export default function HeaderSearch({
  searchPlaceholder,
  searchTerm,
  onSearchChange,
  buttonText,
  onAddClick,
}: HeaderSearchProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto gap-6 px-2">
      
      <div className="relative flex-1 max-w-3xl">
        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg"></i>
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          value={searchTerm}              
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 text-sm bg-white text-slate-800 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400/50 shadow-sm transition-all placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        
        {buttonText && onAddClick && (
          <>
            <button 
              onClick={onAddClick}
              className="bg-white text-blue-700 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm cursor-pointer"
            >
              <i className="bi bi-plus-lg"></i> {buttonText} 
            </button>
            <div className="w-px h-8 bg-blue-400/50 mx-2 hidden sm:block"></div>
          </>
        )}
        
        <button className="text-blue-100 hover:text-white transition-colors hidden sm:block cursor-pointer">
          <i className="bi bi-person-circle text-2xl"></i>
        </button>
      </div>

    </div>
  );
}