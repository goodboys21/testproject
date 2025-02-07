export default async function handler(req, res) {
    const { file } = req.query;

    if (!file) {
        return res.status(400).json({ error: "No file specified" });
    }

    const fileUrl = `https://filezone-cdn.caliph.dev/file/${file}`;

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("File not found");

        res.setHeader("Content-Type", response.headers.get("Content-Type"));
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        response.body.pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch file" });
    }
}
