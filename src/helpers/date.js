
class DateFormatter {
    constructor(date) {
        this.date = new Date(date);
    }

    format() {
        return this.date.toJSON().slice(0, 19).replace('T', ' ');
    }
}

export default DateFormatter;