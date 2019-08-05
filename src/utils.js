const slug = function slug(text) {
    return text.toLowerCase()
        .replace(/[^\w]+/g, ' ')
        .trim()
        .replace(/[\s]+/g, '-');

}

const lpad = function lpad(number, chars = 2, char = '0') {
    return (char.repeat(chars) + number).substr(-chars);
}

module.exports = {
    slug,
    lpad,
};