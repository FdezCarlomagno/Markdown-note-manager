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
                        className={`px-4 py-2 rounded text-sm font-medium transition-colors
                            ${
                                selectedFormat.base === value 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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