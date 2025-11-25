/**
 * Servicio puro para validación de SQL.
 * Normaliza y compara queries.
 */
export class SQLValidator {
    /**
     * Normaliza una query SQL para comparación
     * @param {string} sql 
     * @returns {string}
     */
    static normalize(sql) {
        if (!sql) return '';
        return sql
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/;\s*$/, '')
            .trim();
    }

    /**
     * Valida si la respuesta del usuario coincide con la solución
     * @param {string} userQuery 
     * @param {string} solution 
     * @returns {boolean}
     */
    static validate(userQuery, solution) {
        const normalizedUser = this.normalize(userQuery);
        const normalizedSolution = this.normalize(solution);
        return normalizedUser === normalizedSolution;
    }
}
