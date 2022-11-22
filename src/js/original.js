function fetchlike(e) {
  return "function" == typeof fetch
    ? fetch("https://gql.twitch.tv/gql", e)
    : new Promise(function (t, o) {
        var i = new XMLHttpRequest();
        i.open("POST", "https://gql.twitch.tv/gql"),
          Object.keys(e.headers).forEach(function (t) {
            try {
              i.setRequestHeader(t, e.headers[t]);
            } catch (e) {
              console.error(e);
            }
          }),
          (i.withCredentials = "include" === e.credentials),
          (i.onerror = o),
          (i.onload = function () {
            var e = {
              status: i.status,
              statusText: i.statusText,
              body: i.response || i.responseText,
              ok: i.status >= 200 && i.status < 300,
              json: function () {
                return new Promise(function (t, o) {
                  try {
                    t(JSON.parse(e.body));
                  } catch (e) {
                    o(e);
                  }
                });
              },
            };
            t(e);
          }),
          i.send(e.body);
      });
}

for (
  var entries = document.cookie.split("; "),
    cookies = {},
    i = entries.length - 1;
  i >= 0;
  i--
) {
  var entry = entries[i].split("=", 2);
  cookies[entry[0]] = entry[1];
}

var vodID,
  channelName,
  authorization = cookies["auth-token"]
    ? "OAuth " + cookies["auth-token"]
    : void 0,
  clientId = "kimne78kx3ncx6brgo4mv6wki5h1ko",
  commonOptions = {
    method: "POST",
    headers: {
      "Accept-Language": "en-US",
      Accept: "*/*",
      Authorization: authorization,
      "Client-ID": clientId,
      "Content-Type": "text/plain; charset=UTF-8",
      "Device-ID": cookies.unique_id,
    },
  },
  playerType = "site",
  playerRoutesExact = (window.__twilightSettings &&
    window.__twilightSettings.player_routes_exact) || [
    "activate",
    "bits",
    "bits-checkout",
    "directory",
    "following",
    "popout",
    "prime",
    "store",
    "subs",
  ],
  playerRoutesStartsWith = window.__twilightSettings
    ? window.__twilightSettings.player_routes_startswith || [
        "bits-checkout/",
        "cheering-checkout/",
        "checkout/",
        "collections/",
        "communities/",
        "dashboard/",
        "directory/",
        "event/",
        "prime/",
        "products/",
        "settings/",
        "store/",
        "subs/",
      ]
    : [
        "bits-checkout/",
        "checkout/",
        "collections/",
        "communities/",
        "dashboard/",
        "directory/",
        "event/",
        "prime/",
        "products/",
        "settings/",
        "store/",
        "subs/",
      ],
  pathname = window.location.pathname.substr(1);
-1 === playerRoutesExact.indexOf(pathname) &&
  0 ===
    playerRoutesStartsWith.filter(function (e) {
      return pathname.startsWith(e);
    }).length &&
  (pathname.startsWith("videos/")
    ? (vodID = (vodID = pathname
        .replace("videos/", "")
        .replace(/\//g, "")).startsWith("v")
        ? vodID.substr(1)
        : vodID)
    : (channelName = pathname.replace(/\//g, "")));
var query =
    'query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!) {  streamPlaybackAccessToken(channelName: $login, params: {platform: "web", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isLive) {    value    signature    __typename  }  videoPlaybackAccessToken(id: $vodID, params: {platform: "web", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isVod) {    value    signature    __typename  }}',
  bodyBase = {
    operationName: "PlaybackAccessToken_Template",
    query: query,
  };

async function getAccessToken(channelName = "zilioner") {
  var body = JSON.stringify(
    Object.assign({}, bodyBase, {
      variables: {
        isLive: !0,
        login: channelName,
        isVod: !1,
        vodID: "",
        playerType: playerType,
      },
    })
  );
  return fetchlike(Object.assign({}, commonOptions, { body: body })).then(
    function (e) {
      return e.json();
    }
  );
}

export default getAccessToken;
