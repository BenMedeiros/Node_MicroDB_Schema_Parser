function isValidUtf8(str) {
    console.log(str, str.length, Array.from(str), Array.from(str).length);
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        console.log(charCode, str.codePointAt(i));
        if (charCode > 0x10FFFF) {
            return false;
        }
    }
    return true;
}

// Example usage
const testString = "This oding.";
// const isUtf8 = isValidUtf8(testString);
const invalidUtf8String = String.fromCharCode(4)+ String.fromCharCode(56834);;
console.log(isValidUtf8(invalidUtf8String));

const emoji = "😂";
console.log(isValidUtf8(emoji));