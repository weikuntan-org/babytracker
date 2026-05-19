// Photo-upload helper. Reads a `File`, base64-encodes it, ships it to the
// `babytracker/upload_photo` WS command, returns the resulting
// `media-source://` path the backend wrote the file to under
// `/config/media/babytracker/`.

export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

const SUPPORTED_MIMES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif"
]);

export class PhotoUploadError extends Error {
    code: string;
    constructor(code: string, message: string) {
        super(message);
        this.code = code;
    }
}

function _fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result !== "string") {
                reject(new PhotoUploadError("read_failed", "FileReader returned non-string"));
                return;
            }
            // Strip the `data:<mime>;base64,` prefix.
            const idx = result.indexOf(",");
            resolve(idx >= 0 ? result.slice(idx + 1) : result);
        };
        reader.onerror = () =>
            reject(new PhotoUploadError("read_failed", "FileReader failed"));
        reader.readAsDataURL(file);
    });
}

export async function uploadPhoto(
    hass: any,
    file: File
): Promise<{ photo_path: string }> {
    if (file.size > PHOTO_MAX_BYTES) {
        throw new PhotoUploadError(
            "too_large",
            `Photo is ${Math.round(file.size / (1024 * 1024))} MB; max is 5 MB`
        );
    }
    const mime = (file.type || "").toLowerCase();
    if (!SUPPORTED_MIMES.has(mime)) {
        throw new PhotoUploadError(
            "unsupported_mime",
            `Unsupported photo type: ${file.type || "unknown"}`
        );
    }
    const data = await _fileToBase64(file);
    try {
        const result = await hass.connection.sendMessagePromise({
            type: "babytracker/upload_photo",
            data,
            mime
        });
        const path = (result as any)?.photo_path;
        if (typeof path !== "string" || !path) {
            throw new PhotoUploadError("bad_response", "upload returned no photo_path");
        }
        return { photo_path: path };
    } catch (err: any) {
        if (err instanceof PhotoUploadError) throw err;
        const code = err?.code ?? "upload_failed";
        const message = err?.message ?? "upload failed";
        throw new PhotoUploadError(code, message);
    }
}
