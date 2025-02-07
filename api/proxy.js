export default async function handler(req, res) {
    const { file } = req.query;

    if (!file) {
        return res.status(400).json({ error: "No file specified" });
    }

    // Format URL FileZone dengan encode biar aman
    const fileUrl = `https://filezone-cdn.caliph.dev/file/${encodeURIComponent(file)}`;

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

        // Ambil Content-Type dari file asli
        res.setHeader("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

        // Stream data langsung ke response
        response.body.pipe(res);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch file: ${error.message}` });
    }
}
