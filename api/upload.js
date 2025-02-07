export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const formData = new FormData();
        formData.append("reqtype", "fileupload");
        formData.append("fileToUpload", req.body.file);

        const response = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: formData
        });

        const uploadedUrl = await response.text();
        if (uploadedUrl.startsWith("https://")) {
            return res.json({ url: uploadedUrl });
        } else {
            return res.status(500).json({ error: "Gagal upload ke Catbox.moe" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Kesalahan: " + error.message });
    }
}
