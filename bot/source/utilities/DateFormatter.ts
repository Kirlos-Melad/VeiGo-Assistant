import moment from "moment";

type Time = {
	hours: number;
	minutes: number;
	seconds: number;
};

class DateFormatter {
	private readonly DATE_FORMAT: string;
	private readonly DATE_FORMAT_LONG: string;

	constructor() {
		this.DATE_FORMAT = "YYYY/MM/DD";
		this.DATE_FORMAT_LONG = `${this.DATE_FORMAT} [at] hh:mm:ss a`;
	}

	public Format(date: moment.MomentInput) {
		return moment(date).format(this.DATE_FORMAT);
	}

	public FormatLong(date: moment.MomentInput) {
		return moment(date).format(this.DATE_FORMAT_LONG);
	}

	public ValidateFormat(date: moment.MomentInput) {
		return moment(date, this.DATE_FORMAT, true).isValid();
	}

	public ValidateFormatLong(date: moment.MomentInput) {
		return moment(date, this.DATE_FORMAT_LONG, true).isValid();
	}

	public ConvertToMS(time: Time) {
		const { hours = 0, minutes = 0, seconds = 0 } = time;

		let ms_time = hours * 3600000;
		ms_time += minutes * 60000;
		ms_time += seconds * 1000;

		return ms_time;
	}

	public ConvertToTime(milliseconds: number): Time {
		let temp = milliseconds % 3600000;
		const hours = Math.floor(milliseconds / 3600000);
		const minutes = Math.floor(temp / 60000);
		temp = temp % 60000;
		const seconds = Math.floor(temp / 1000);

		return { hours, minutes, seconds };
	}
}

export default new DateFormatter();
