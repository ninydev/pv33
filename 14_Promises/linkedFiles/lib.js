document.getElementById("cmdLoad").addEventListener("click", function () {
    console.log("Loading...");

    console.log("a = " + a);
    console.log("b = " + b);
})

// if (a !== undefined) {
//     console.log("a = " + a);
//     console.log("b = " + b);
// }

document.body.onload = function () {
    console.log("Loaded!");
    console.log("a = " + a);
    console.log("b = " + b);
    console.log("c = " + c);
}
