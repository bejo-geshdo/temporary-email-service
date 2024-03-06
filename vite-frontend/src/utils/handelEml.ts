import { LetterparserAttachment } from "letterparser";
import { fromByteArray } from "base64-js";

export async function downloadEml(apiUrl: string, messageId: string) {
  const emlUrl = await getDownloadUrl(apiUrl, messageId);

  const blobResponse = await fetch(emlUrl);
  const blob = await blobResponse.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "test.eml"; // Use fileName here
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function getDownloadUrl(apiUrl: string, messageId: string) {
  const response = await fetch(
    `${apiUrl}getSingedUrls?messageId=${messageId}`
  ).then((response) => response.json());
  return response.url as string;
}

export function rewriteSrc(
  url: string,
  attachments: LetterparserAttachment[]
): string {
  if (url.startsWith("cid:")) {
    const image = url.split(":")[1].split("@")[0];

    const imageAtt = attachments.filter((a) => a.contentId === image);
    console.log("imageAtt: ", imageAtt);

    if (imageAtt.length > 0) {
      return `data:${imageAtt[0].contentType.type};base64,${fromByteArray(
        imageAtt[0].body as Uint8Array
      )}`;
    }
  } else {
    return url;
  }
  return url;
}
