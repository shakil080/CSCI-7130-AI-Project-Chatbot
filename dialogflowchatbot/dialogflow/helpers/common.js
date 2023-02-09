/**
 * isDefined
 * This will check of the varible or object is defined or not
 * @param  {} obj
 */
const isDefined = (obj) => {
    if (typeof obj === "undefined") {
        return false;
    }

    if (!obj) {
        return false;
    }
    //Because null == undefined is true, the BELOW code will catch both null and undefined
    return obj != null;
}
/**
 * isValidArray
 * This will check if the array is valid or not
 * @param  {} objarray
 */
const isValidArray = (objarray) => {

    if (!Array.isArray(objarray) || !objarray.length) {
        // array does not exist, is not an array, or is empty
        // ⇒ do not attempt to process array
        return false;
    }

    return true;
}
/**
 * isValidString
 * Checks whether the string is valid or not
 * @param  {} objstring
 */
const isValidString = (objstring) => {
    return (typeof objstring === 'string' || objstring instanceof String)
}
/**
 * isNumeric
 * Checks whether the number is valid or not
 * @param  {} num
 */
const isNumeric = (num) =>{
    return !isNaN(num)
}

module.exports = {
    isDefined,
    isValidArray,
    isValidString,
    isNumeric
}