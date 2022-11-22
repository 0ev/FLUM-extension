import getAccessToken from "./original";
import { Parser } from "m3u8-parser";

const main = async () => {
  const accessToken = await getAccessToken();
  const streamPlaybackAccessToken =
    accessToken.data.streamPlaybackAccessToken.value;
  const signature = accessToken.data.streamPlaybackAccessToken.signature;
  const querys = { sig: signature, token: streamPlaybackAccessToken };
  const query = new URLSearchParams(querys).toString();
  const channelName = "zilioner";
  const url = `https://usher.ttvnw.net/api/channel/hls/${channelName}.m3u8?${query}`;
  const resp = await fetch(url);
  const text = await resp.text();
  var parser = new Parser();
  parser.push(text);
  parser.end();
  const manifest = parser.manifest;
  const bestQuality = manifest.playlists[0];
  const bestQualityUrl = bestQuality.uri;
  console.log(bestQualityUrl);
  console.log(bestQuality);

  loop2s(bestQualityUrl);
};

// function that loops every 2 seconds
const loop2s = async (uri) => {
  while (true) {
    const m3u8resp = await fetch(uri);
    const m3u8text = await m3u8resp.text();
    chrome.runtime.sendMessage({ m3u8text: m3u8text });
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

main();
