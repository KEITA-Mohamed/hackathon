
export function parseCsv(csvString: string) {

    const lines = csvString.split(/\r?\n/).filter((line) => line.trim() !== "");

    if(lines.length === 0){
        throw new Error("Le fichier CSV est vide");
    }

    const headers = parseCSVLine(lines[0]);

    const data = lines.slice(1).map((line)=> parseCSVLine(line));

    return {headers, data};

}

function parseCSVLine(line: string): string[]{

    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
            // Gérer les guillemets - basculer l'état inQuotes
            // Vérifier s'il s'agit d'un guillemet échappé (double guillemet)
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                current += '"'
                i++
            } else {
                inQuotes = !inQuotes
            }
        } else if (char === "," && !inQuotes) {
            result.push(current)
            current = ""
        } else {

            current += char
        }
    }

    result.push(current)

    return result
}
