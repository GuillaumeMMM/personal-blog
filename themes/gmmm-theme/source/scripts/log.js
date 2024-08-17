async function postLog() {
    await fetch("https://guillaume-bloglogs.web.val.run", {
        method: "PUT",
        body: JSON.stringify({
            url: location.href,
            loc: Intl.DateTimeFormat().resolvedOptions().timeZone
        }),
    });
    return;
}
if (!location.host.includes('localhost')) {
    postLog()
}