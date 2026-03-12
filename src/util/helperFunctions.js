import moment from "moment";

export const handleImageError = (e, img) => {
    return e.target.src = img; // your fallback image
};

export const formatProgramDates = (programs) => {
    if (!Array.isArray(programs)) return [];

    return programs.map((program) => {
        const formattedProgram = { ...program };

        // Convert start date only if it exists
        if (program.start) {
            formattedProgram.start = moment(program.start).toDate();
        }

        // Convert end date only if it exists
        if (program.end) {
            formattedProgram.end = moment(program.end).toDate();
        }

        return formattedProgram;
    });
};

export const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const capitalizeEachWord = (string) => {
    if (!string) return '';

    // Handles multiple spaces, tabs, and other whitespace
    return string
        .split(/\s+/)
        .map(word => {
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};