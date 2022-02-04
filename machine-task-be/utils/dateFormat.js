const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

module.exports = (date) => {
    const d = new Date(date);

    const month = monthNames[d.getMonth()];
    const day = `0${d.getDate()}`;
    const year = `${d.getFullYear()}`;
    // return `${d}`;
    return `${month} ${day.slice(-2)} ${year.slice(2)}`;
}