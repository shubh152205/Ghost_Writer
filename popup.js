// --- BUTTON 1: GEEKSFORGEEKS / CODE EDITOR MODE ---
document.getElementById("gfgBtn").addEventListener("click", async () => {
  const text = document.getElementById("sourceText").value;
  if (!text) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: insertBlockText, // Uses a different function
    args: [text],
  });
  window.close();
});

// --- BUTTON 2: STANDARD SLOW TYPE MODE (BACKUP) ---
document.getElementById("stdBtn").addEventListener("click", async () => {
  const text = document.getElementById("sourceText").value;
  if (!text) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: simulateSlowTyping,
    args: [text],
  });
  window.close();
});


// --- FUNCTION 1: The Fix for GeeksforGeeks ---
function insertBlockText(text) {
  const activeElement = document.activeElement;
  if (!activeElement) {
    alert("Please click inside the code editor first!");
    return;
  }

  // This command mimics a "Drag and Drop" or "IME Input" event.
  // It bypasses paste blocks but treats text as a single chunk, 
  // preventing the "vertical text" formatting issue.
  document.execCommand('insertText', false, text);
}


// --- FUNCTION 2: The Old Slow Type (Keep as backup) ---
function simulateSlowTyping(text) {
  const element = document.activeElement;
  let i = 0;
  function type() {
    if (i < text.length) {
      const char = text[i];
      element.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
      element.dispatchEvent(new KeyboardEvent('keypress', { key: char }));
      
      if (element.isContentEditable) {
        element.textContent += char;
      } else {
        element.value += char;
      }
      
      element.dispatchEvent(new KeyboardEvent('keyup', { key: char }));
      element.dispatchEvent(new Event('input', { bubbles: true }));
      i++;
      setTimeout(type, 10);
    }
  }
  type();
}