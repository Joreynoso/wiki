/* Panic function 
Write a PANIC! function. The function should take in a sentence and return the same
sentence in all caps with an exclamation point (!) at the end. Use JavaScript's
built in string methods. 

If the string is a phrase or sentence, add a 😱 emoji in between each word. 

Example input: "Hello"
Example output: "HELLO!"

Example input: "I'm almost out of coffee"
Example output: "I'M 😱 ALMOST 😱 OUT 😱 OF 😱 COFFEE!"

.split() .join()
*/


// const to try functions
const sentence = "Jelou"
const fullSentence = "I'm almost out of coffee"

// panic function
function panic(sentence) {
    
    if(!sentence || sentence === ""){
        console.log('la sentencia debe ser una palabra o una frase')
        return
    }
    
    return sentence
    .split(" ") // convierte a un array y lo separa por espacios
    .join(" 😱 ")
    .toUpperCase() + "!"
}


// Test your function
console.log(panic("I'm almost out of coffee"));
console.log(panic("hello"))

