document.addEventListener("DOMContentLoaded", () =>{
    //storing local storage data
    const localStorageKey = "quotesStorage";
    const sessionStorageKey = "lastViewedQuote";

    //storing quotes 
    const quotes = JSON.parse(localStorage.getItem(localStorageKey)) ||[
        {text: "The best way to predict the future is to start doing hard thing.", category: "Motivation"},
        {text: "Do what you can, with what yiu have, where you are.", category: "Inspiration"},
        {text: "Success is not final, failure is not the end of the world: its the courage to continue that counts.", category: "Rerseverance"}
    ];

    // get the html elements

    const quotesDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");

    function saveQuote(){
        localStorage.setItem(localStorageKey, JSON.stringify(quotes))
    }

    // fetch quote from the server and updates from local stotage
    const apiUrl = "https://jsonplaceholder.typicode.com/posts";
    let quote =JSON.parse(localStorage.getItem("quotes")) || [];
    async function synQuotesWithServer() {
        try{
            const response = await fetch(apiUrl);
            const serverQuotes = await response.json();

            if (!serverQuotes || serverQuotes.length === 0){
                console.warn("No new quotes for the server.");
                return;
            }

            let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

            // merge and handle conflits 
            let updatesQuotes = mergeQuotes(localQuotes, serverQuotes);

            //save to local storage
            localStorage.setItem("quotes", JSON.stringify(updatesQuotes));

            console.log("Quotes synced successfully!");
            displayQuotes(); // refress ui

        } catch (error) {
            console.log("Error syncing quotes:", error);
        }
        
    }

    function mergeQuotes (local, server) {
        const localMap = new Map(local.map(q => [q.id, q]));
        server.forEach(q => {
            if (!localMap.has(q.id) || localMap.get(q.id).updatedAt < q.updatedAt){
                localMap.set(q.id,q);
            }
        });
        return Array.from(localMap.values());
            
        }
    }

    setInterval(synQuotesWithServer, 1000);

    //display quote ui

    function fetchQuotesFromServer() {
        const quoteDisplay = document.getElementById("quoteDisplay");
        quoteDisplay.innerHTML = quote.map(q => `<p><b>${q.category}</b>:${q.text}</p>`).join("") || "<p> no quotes available"
    }

    function addQuote (text, catergory){
        const newQuote = {
            id:Date.now(),
            text,
            catergory,
            updatedAt: new Date().toISOString()
        };
    
        quote.parse(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        displayQuotes();
    }

//filter optios 

function populateCategories() {
    const catergoryFilter = document.getElementById("category");
    catergoryFilter.innerHTML = `<option value="all">All Categories</option>`;

    const uniqueCategories = [...new set(quotes.map(quotes => quotes.category))];
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        catergoryFilter.appendChild(option);
    });

    //Remember the Last Selected Filter

    const lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
    catergoryFilter.value = lastSelectedCategory;
}
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    let filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = filterQuotes.length
    ? filteredQuotes.map(q => `<p><b>${q.category}</b>: ${q.text}</p>`).join("")
    : "<p>No quotes available for this category.</p>";

}
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
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
        
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
        // showRandomQuote(); 
         populateCategories();  
        filterQuotes();  
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

    function exportToJson() {
        const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], {type: "application/json"});
        const url =URL.createObjectURL(jsonBlob);
        const a = document.createElement("a");
        a.click();
        document.body.appendChild(a);
        URL.revokeObjectURL(url);
    }

    function importFromJsonFile(event){
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try{
                const importedQuotes = JSON.parse(event.target.result);
                if (!Array.isArray(importedQuotes)) {
                    throw new Error("invalid format");
                }
                quotes.push(...importedQuotes);
                saveQuote();
                alert("Quotes is Imported Successfully!");
                showRandomQuote();
            } catch(error){
                alert("Invalid JSON file. please check the format")
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function createImportExportButtton(){
        const exportBtn = document.createElement("button");
        exportBtn.innerText = "Export Quotes";
        exportBtn.addEventListener("click", exportToJson);
        document.body.appendChild(exportBtn);

        const importInput = document.createElement("input");
        importInput.input = "file";
        importInput.accept = ".json";
        importInput.addEventListener("change", importFromJsonFile);
        document.body.appendChild(importInput);

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
createImportExportButtton();

//to load viewed quote from session storage
const lastViewedQuote = JSON.parse(sessionStorage.getItem(sessionStorageKey));
if (lastViewedQuote) {
    quotesDisplay.innerHTML = `<p><b>${lastViewedQuote.category}</b>: ${lastViewedQuote.text}</p>`
}
  showRandomQuote();
});
displayQuotes();
syncQuotesWithServer();