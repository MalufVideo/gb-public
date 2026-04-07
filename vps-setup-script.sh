#!/bin/bash
# WhatsApp API Update Script
# Run this on your VPS: bash vps-setup-script.sh

echo "=========================================="
echo "WhatsApp API PDF Support Setup"
echo "=========================================="
echo ""

# Navigate to whatsapp-api directory
cd ~/whatsapp-api || exit 1

# Install CORS package
echo "1. Installing cors package..."
npm install cors

# Backup current app.js
echo "2. Backing up current app.js..."
cp app.js app.js.backup.$(date +%Y%m%d_%H%M%S)

# Add the new endpoint
echo "3. The /send-pdf endpoint needs to be added manually to app.js"
echo ""
echo "Add this code after the /send endpoint:"
echo ""
cat << 'EOF'
// SEND PDF
app.post("/send-pdf", async (req, res) => {
    if (!clientReady)
        return res.status(503).json({ error: "Client not ready" });

    const { to, message, pdf, filename } = req.body;
    if (!to || !pdf)
        return res.status(400).json({ error: "to + pdf required" });

    try {
        const number = to.replace(/\D/g, "");
        const chatId = `${number}@c.us`;

        const media = new MessageMedia(
            'application/pdf',
            pdf,
            filename || 'document.pdf'
        );

        const caption = message || 'Documento PDF anexo';
        const result = await client.sendMessage(chatId, media, { caption });

        logger.info(`📄 PDF sent to ${number}: ${filename}`);
        res.json({ success: true, id: result.id._serialized, filename });
    } catch (err) {
        logger.error("Send PDF failed:", err);
        res.status(500).json({ error: "Failed to send PDF", details: err.message });
    }
});
EOF

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit app.js: nano ~/whatsapp-api/app.js"
echo "2. Add the /send-pdf endpoint shown above"
echo "3. Add 'const cors = require(\"cors\");' at the top"
echo "4. Add 'app.use(cors());' after const app = express();"
echo "5. Restart the service: pm2 restart whatsapp-api"
echo ""
echo "Or use the complete updated file: whatsapp-api-app-updated.js"
echo ""
