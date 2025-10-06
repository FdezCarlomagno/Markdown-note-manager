import { SetStateAction } from "react"
import { MdBases } from "./markdownBase"
import { SelectedFormat } from "./QuickFormat"

interface Props {
    selectedFormat: SelectedFormat
    onSelect: React.Dispatch<SetStateAction<SelectedFormat>>
    onToggle: () => void
}

// Función para formatear las claves a nombres legibles
const formatKeyToLabel = (key: string) => {
    const formatted = key
        .replace(/Base$/, '') // Eliminar 'Base' del final
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Separar camelCase
        .replace(/(\d)/, ' $1') // Separar números para los encabezados

    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export const ElementBar = ({ selectedFormat, onSelect, onToggle }: Props) => {
    // Filtramos elementos que no necesitan botón
    const excludedKeys = [
        'tableHeaderSeparator',
        'tableColumnSeparator',
        'tableNewRow',
        'commentEndBase',
        'space',
        'horizontalRuleBase'
    ]

    return (
        <div className="flex flex-wrap gap-2 m-3">
            {Object.entries(MdBases)
                .filter(([key]) => !excludedKeys.includes(key))
                .map(([key, value]) => (
                    <button
                        key={key}
                        onClick={() => {
                            onSelect({
                                ...selectedFormat,
                                base: value as string,
                                name: formatKeyToLabel(key)
                            })
                            onToggle()
                        }}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
                        ${selectedFormat.base === value
                                ? 'bg-gray-900 text-white border-gray-700 shadow-md hover:bg-gray-800' // Seleccionado
                                : 'bg-gray-700 text-gray-500 border-gray-300 hover:bg-gray-200'       // No seleccionado
                            }`}
                        title={`Insertar ${formatKeyToLabel(key)}`}
                    >
                        {/* Iconos para elementos comunes */}
                        {key.startsWith('h') && <span>H{key[1]}</span>}
                        {key === 'boldBase' && <span>B</span>}
                        {key === 'italicBase' && <em>I</em>}
                        {key === 'codeBlockBase' && <code>{"</>"}</code>}
                        {!key.startsWith('h') &&
                            !['boldBase', 'italicBase', 'codeBlockBase'].includes(key) &&
                            formatKeyToLabel(key)}
                    </button>
                ))}
        </div>
    )
}
