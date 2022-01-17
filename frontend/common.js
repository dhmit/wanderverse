/**
 * Common.js -- miscellaneous routines useful throughout the system
 */


/**
 * Get the value of a cookie, given its name
 * Adapted from https://docs.djangoproject.com/en/2.2/ref/csrf/#ajax
 * @param {string} name - The name of the cookie
 */
export function getCookie(name) {
    let cookieValue;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (const rawCookie of cookies) {
            const cookie = rawCookie.trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const colors = [
    "#0C00FF",
    "#3D2DFD",
    "#6D5BFB",
    "#9E88FA",
    "#CEB6F8",
    "#FFE3F6",
];

export function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}


export function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
