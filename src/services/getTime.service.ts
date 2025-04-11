export default function getTime () {
    const [currentDate, currentTime] = getDate();

    function getDate() {
        const date = new Date();
        let day = date.getDate() + 1 > 9 ? date.getDate() : "0" + date.getDate();
        let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        let year = date.getFullYear();
        let hour = date.getHours() + 1 > 9 ? date.getHours() : "0" + date.getHours();
        let minute = date.getMinutes() + 1 > 9 ? date.getMinutes() : "0" + date.getMinutes();
        let currentDate = `${day}/${month}/${year}`;
        let currentTime = `${hour}:${minute}`;
        return [currentDate, currentTime];
    }
    
    return [currentDate, currentTime];
}