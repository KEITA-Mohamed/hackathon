export default function getTime() {
    const date = new Date();

    const formatterDate = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const formatterTime = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const currentDate = formatterDate.format(date);
    const currentTime = formatterTime.format(date);

    return [currentDate, currentTime];
}
