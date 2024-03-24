document.getElementById("qrForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const githubLink = document.getElementById("githubLink").value;
  
    fetch("qr/generate-qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ githubLink })
    })
    .then(response => response.json())
    .then(data => {
      const qrCodeContainer = document.getElementById("qrCodeContainer");
      qrCodeContainer.innerHTML = `<img src="${data.qrCode}" alt="QR Code">`;
      
    })
    .catch(error => console.error("Error:", error));
  });