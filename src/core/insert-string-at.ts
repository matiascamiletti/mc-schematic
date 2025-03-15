export function insertStringAt(originalString: string, stringToInsert: string, position: number): string {
    if (position > originalString.length) {
        // Si la posición está fuera del rango, simplemente agrega el string al final
        return originalString + stringToInsert;
    }
    
    // Dividir el original en dos partes: antes y después de la posición
    const before = originalString.slice(0, position);
    const after = originalString.slice(position);

    // Insertar el string en la posición deseada
    return before + stringToInsert + after;
}