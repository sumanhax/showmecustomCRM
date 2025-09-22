export const DomainReplace = (url) => {
    console.log("URL", url);
    const newBaseUrl = url.replace(/^https?:\/\//, "")
    return newBaseUrl

}