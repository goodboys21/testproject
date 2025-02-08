import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const form = new IncomingForm();
    form.uploadDir = path.join(process.cwd(), "public/uploads");
    form.keepExtensions = true;

    if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: "Upload gagal!" });
        }

        const file = files.file[0];
        const fileName = Date.now() + "-" + file.originalFilename;
        const filePath = path.join(form.uploadDir, fileName);
        fs.renameSync(file.filepath, filePath);

        const fileUrl = `https://${process.env.VERCEL_URL}/uploads/${fileName}`;
        res.status(200).json({ url: fileUrl });
    });
}
