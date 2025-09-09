/**
 * Validates poll creation input
 * @param {Object} pollData - Poll creation data
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
export function validatePollInput(pollData) {
    const errors = [];

    if (!pollData.title?.trim()) {
        errors.push('Title is required');
    }

    if (!Array.isArray(pollData.options) || pollData.options.length < 2) {
        errors.push('At least 2 options are required');
    }

    if (!pollData.expiresAt || new Date(pollData.expiresAt) <= new Date()) {
        errors.push('Valid expiration date is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}