// ADD THIS NEW ENDPOINT TO YOUR app.js ON THE VPS (after the /send endpoint)

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

        // Create MessageMedia from base64 PDF
        const media = new MessageMedia(
            'application/pdf',
            pdf,
            filename || 'document.pdf'
        );

        // Send message with caption if provided
        const caption = message || 'Documento PDF anexo';
        const result = await client.sendMessage(chatId, media, { caption });

        logger.info(`PDF sent to ${number}: ${filename}`);
        res.json({ success: true, id: result.id._serialized });
    } catch (err) {
        logger.error("Send PDF failed:", err);
        res.status(500).json({ error: "Failed to send PDF" });
    }
});

// INSTRUCTIONS:
// 1. SSH into your VPS: ssh root@72.60.142.28
// 2. Edit the app.js file: nano ~/whatsapp-api/app.js
// 3. Add the /send-pdf endpoint above (after the /send endpoint, before the START section)
// 4. Save and exit (Ctrl+X, then Y, then Enter)
// 5. Restart the WhatsApp API service or PM2 process
//    - If using PM2: pm2 restart whatsapp-api
//    - If running directly: Stop the current process and run: node app.js
