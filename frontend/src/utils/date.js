const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

const diffDate = (dateString) => {
    const dateNow = new Date()
    const date = new Date(dateString)

    const diffMs = dateNow - date

    let diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return "hoje";
    if (diffDays === 1) return "1d";
    if (diffDays < 30) return `${diffDays} d`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "1m";
    if (diffMonths < 12) return `${diffMonths}m`;

    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) return "1a";

    return `${diffYears}a`;
}

export { formatDate, diffDate }
