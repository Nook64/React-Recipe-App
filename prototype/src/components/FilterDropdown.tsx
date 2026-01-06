import {ChevronDown, Check, X, Filter as FilterIcon } from "lucide-react";

export type FilterOption = {
    value: string;
    label: string;
    icon: React.ReactNode;
};

type FilterDropdownProps = {
    options: FilterOption[];
    selected: string[];
    isOpen: boolean;
    onToggleOpen: () => void;
    onToggleSelect: (value: string) => void;
    onClearAll: () => void;
};

function FilterDropdown({
    options,
    selected,
    isOpen,
    onToggleOpen,
    onToggleSelect,
    onClearAll,
}: FilterDropdownProps) {
    return (
        <div className="lg:w-1/3 relative">
            <button
                onClick={onToggleOpen}
                className={`flex items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-2 rounded-xl hover:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all w-full h-full ${
                    isOpen ? "border-green-500" : "border-gray-200"
                }`}
                type="button"
            >
                <div className="flex items-center gap-3">
                    <FilterIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">
                        Filter
                        {selected.length > 0 && (
                            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                {selected.length}
                            </span>
                        )}
                    </span>
                </div>
                <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                    isOpen ? "rotate-180" : ""
                }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden">
                    <div className="max-h-82 overflow-y-auto">
                        <div className="p-5 border-b border-gray-100 bg-emerald-200">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-bold text-gray-800 md:text-xl">
                                    Filter auswählen
                                </h4>

                                {selected.length > 0 && (
                                    <button
                                    onClick={onClearAll}
                                    className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
                                    type="button"
                                    >
                                        <X className="w-4 h-4" />
                                        Zurücksetzen
                                    </button>
                                )}
                            </div>

                            <p className="text-gray-600 mt-1 text-sm md:text-base">
                                Mehrfachauswahl möglich
                            </p>
                        </div>

                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {options.map((filter) => {
                                const isSelected = selected.includes(filter.value);

                                return (
                                    <button
                                    key={filter.value}
                                    onClick={() => onToggleSelect(filter.value)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                                        isSelected
                                        ? "bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-[1.02]"
                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    }`}
                                    type="button"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{filter.icon}</span>
                                            <span
                                            className={`font-medium ${
                                                isSelected ? "font-bold" : ""
                                            }`}
                                            >
                                                {filter.label}
                                            </span>
                                        </div>
                                        {isSelected && <Check className="w-5 h-5" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterDropdown;
