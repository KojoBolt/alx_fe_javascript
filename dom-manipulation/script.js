document.addEventListener("DOMContentLoaded", () =>{
    //using event listner to collect arrays of quotes
    const quotes = [
        {text: "The best way to predict the future is to start doing hard thing.", category: "Motivation"},
        {text: "Do what you can, with what yiu have, where you are.", category: "Inspiration"},
        {text: "Success is not final, failure is not the end of the world: its the courage to continue that counts.", category: "Rerseverance"}
    ]

    // get the html elements

    const quotesDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");

    //passing funtion 

    function showRandomQuote (){
        if(quotes.length === 0){
            quotesDisplay.innerText = "No quotes available. Please add a new quote."
            return;
        }
        const randomIndex = Math.floor(Math.random()* quotes.length);
        const randomQuote = quotes[randomIndex];
        quotesDisplay.innerHTML = `<p><b>${randomQuote.category}</b>:${randomQuote.text}</p>`
    }

    function addQuote(){
        const newQuoteText = document.getElementById("newQuoteText");
        const newQuoteCategory = document.getElementById("newQuoteCategory");
        
        const quoteText = newQuoteText.value.trim();
        const quoteCategory = newQuoteCategory.value.trim();

        if (quoteText === "" || quoteCategory === ""){
            alert("Please enter a quote and a category.");
            return;
        }

        quotes.push({text: quoteText, category: quoteCategory});
        newQuoteText.value = "";
        newQuoteCategory.value = "";
        alert("Quote added succefully!");
        showRandomQuote();
    }

    //creating and input field dynamically using the createElement and appendChild
    function createAddQuoteForm() {
        const quoteInputDiv = document.createElement("div");

    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a quote"; 
    quoteInputDiv.appendChild(quoteInput); 

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter a catergory"; 
    quoteInputDiv.appendChild(categoryInput);

    const addQuoteButton = document.createElement("button");
    addQuoteButton.id = "addQuoButton";
    addQuoteButton.innerText = "Add Quote"
    addQuoteButton.addEventListener("click", addQuote);
    quoteInputDiv.appendChild(addQuoteButton);
    document.body.appendChild(quoteInputDiv);
    }
       
//     document.body.insertAdjacentHTML("beforeend", `
//     <div>
//         <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
//         <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
//         <button id="addQuoteButton">Add Quote</button>
//     </div>
  
//   `); 
//   document.getElementById("addQuoteButton").addEventListener("click", addQuote);
if (newQuoteBtn){
    newQuoteBtn.addEventListener("click", showRandomQuote);
}
createAddQuoteForm()// I call a funtion to create the form
  showRandomQuote();
});