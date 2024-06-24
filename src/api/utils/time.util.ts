import moment from 'moment-timezone';

export default (time?: string | number | Date) => {
    if (time) {
        // console.log('hhh', time, time !instanceof Date, typeof time);
        // if(time !instanceof Date) return { unix: 0, long: "Invalid Date" }
        
        const _time = typeof time !== "number" ? time : time / 1000
        let date = moment(_time).tz('Africa/Lagos');
        
        return { unix: date.unix() * 1000, long: date.format('dddd, MMMM D, YYYY h:mm:ss.SSS A') }
    }

    let date = moment(new Date()).tz('Africa/Lagos');
    return { unix: date.unix() *  1000, long: date.format('dddd, MMMM D, YYYY h:mm:ss.SSS A') }
}
