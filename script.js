

//  // Select DOM elements
//     const inputField = document.querySelector('.ask');
//     const responseContainer = document.querySelector('.response-container');
//     const questionAsked = document.querySelector('.question-asked p');
//     const responseText = document.querySelector('.response-text p');
//     const historyDiv = document.getElementById('history');
//     const historyIcon = document.getElementById('history-icon');

//     // History storage
//     let chatHistory = [];

//     // Function to save to history
//     function saveToHistory(question, response) {
//       chatHistory.unshift({ question, response });
//       if (chatHistory.length > 10) { // Limit to last 10
//         chatHistory = chatHistory.slice(0, 10);
//       }
//       updateHistoryDisplay();
//     }

//     // Function to update history display
//     function updateHistoryDisplay() {
//       historyDiv.innerHTML = '';
//       chatHistory.forEach((item, index) => {
//         const historyItem = document.createElement('div');
//         historyItem.className = 'history-item';
//         historyItem.innerHTML = `
//           <div class="question">${item.question}</div>
//           <div class="preview">${item.response.substring(0, 100)}...</div>
//         `;
//         historyItem.addEventListener('click', () => {
//           loadChat(item.question, item.response);
//         });
//         historyDiv.appendChild(historyItem);
//       });
//     }

//     // Function to load chat from history
//     function loadChat(question, response) {
//       questionAsked.textContent = question;
//       responseText.innerHTML = response;
//       responseContainer.classList.add('show');
//       // Scroll to bottom if needed
//       responseContainer.scrollIntoView({ behavior: 'smooth' });
//     }

//     // Function to fetch response from Gemini API
//     async function gemini(query) {
//       // Display the question and show "Thinking..." message
//       questionAsked.textContent = query;
//       responseText.textContent = "Thinking...";
//       responseContainer.classList.add('show');

//       try {
//         // Make API request to Gemini
//         const response = await fetch('https://chatbot-4ocx.onrender.com/ask', {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ query }),
// });


//         // Simple Markdown-to-HTML converter
//         function formatResponse(text) {
//           // Headings
//           text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
//           text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
//           text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

//           // Bold + Italic
//           text = text.replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>');
//           text = text.replace(/\*(.*?)\*/gim, '<i>$1</i>');

//           // Bullet points
//           text = text.replace(/^\* (.*$)/gim, '<li>$1</li>');
//           text = text.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

//           // Line breaks
//           text = text.replace(/\n/g, '<br>');

//           return text.trim();
//         }

//         // Check if response is OK
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         // Parse response
//         const data = await response.json();

//         // Check if the expected data structure exists
//         if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
//           const rawText = data.candidates[0].content.parts[0].text;
//           const formattedResponse = formatResponse(rawText);
//           responseText.innerHTML = formattedResponse;
//           // Save to history
//           saveToHistory(query, formattedResponse);
//         } else {
//           const errorMsg = "Error: No response content received from the API.";
//           responseText.textContent = errorMsg;
//           saveToHistory(query, errorMsg);
//         }

//       } catch (error) {
//         console.error('Error fetching Gemini API:', error);
//         const errorMsg = "Error: Could not fetch response. Please try again.";
//         responseText.textContent = errorMsg;
//         saveToHistory(query, errorMsg);
//       }
//     }

//     // Event listener for Enter key
//     inputField.addEventListener("keydown", function (e) {
//       if (e.key === "Enter" && inputField.value.trim() !== "") {
//         gemini(inputField.value.trim());
//         inputField.value = "";
//       }
//     });

//     // Event listener for send button
//     document.querySelector(".send-button").addEventListener("click", function () {
//       if (inputField.value.trim() !== "") {
//         gemini(inputField.value.trim());
//         inputField.value = "";
//       }
//     });

//     // Event listener for history icon
//     historyIcon.addEventListener('click', function () {
//       const isShown = historyDiv.classList.contains('show');
//       historyDiv.classList.toggle('show');
//       historyIcon.classList.toggle('active');
//       if (!isShown && chatHistory.length > 0) {
//         updateHistoryDisplay();
//       }
//     });











const inputField = document.querySelector('.ask');
const responseContainer = document.querySelector('.response-container');
const questionAsked = document.querySelector('.question-asked p');
const responseText = document.querySelector('.response-text p');
const historyDiv = document.getElementById('history');
const historyIcon = document.getElementById('history-icon');
let chatHistory = [];

// Save chat
function saveToHistory(question, response) {
  chatHistory.unshift({ question, response });
  if (chatHistory.length > 10) chatHistory = chatHistory.slice(0, 10);
  updateHistoryDisplay();
}

// Update chat history display
function updateHistoryDisplay() {
  historyDiv.innerHTML = '';
  chatHistory.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="question">${item.question}</div>
      <div class="preview">${item.response.substring(0, 80)}...</div>`;
    div.onclick = () => loadChat(item.question, item.response);
    historyDiv.appendChild(div);
  });
}

// Load old chat
function loadChat(q, r) {
  questionAsked.textContent = q;
  responseText.innerHTML = r;
  responseContainer.classList.add('show');
  responseContainer.scrollIntoView({ behavior: 'smooth' });
}

// Call backend
async function gemini(prompt) {
  try {
    const response = await fetch("https://chatbot-4ocx.onrender.com//gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    // Check for empty or invalid responses
    const text = await response.text();
    if (!text) throw new Error("Empty response from server");

    const data = JSON.parse(text);
    console.log("Gemini response:", data);
    return data.reply;
  } catch (error) {
    console.error("Error fetching Gemini API:", error);
    return "Sorry, something went wrong. Please try again.";
  }
}


// Input events
document.querySelector(".send-button").onclick = () => {
  if (inputField.value.trim()) {
    gemini(inputField.value.trim());
    inputField.value = "";
  }
};
inputField.onkeydown = e => {
  if (e.key === "Enter" && inputField.value.trim()) {
    gemini(inputField.value.trim());
    inputField.value = "";
  }
};

// History toggle
historyIcon.onclick = () => {
  historyDiv.classList.toggle('show');
  if (historyDiv.classList.contains('show')) updateHistoryDisplay();
};
