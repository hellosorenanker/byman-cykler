export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { ean } = req.query;

    if (!ean) {
        return res.status(400).json({ error: 'EAN required' });
    }

    const apiKey = process.env.BARCODELOOKUP_API_KEY;
    if (!apiKey) {
        return res.status(200).json({ found: false, error: 'API key not configured' });
    }

    try {
        const response = await fetch(
            `https://api.barcodelookup.com/v3/products?barcode=${ean}&formatted=y&key=${apiKey}`
        );

        if (!response.ok) {
            return res.status(200).json({ found: false });
        }

        const data = await response.json();

        if (data.products && data.products.length > 0) {
            const p = data.products[0];
            return res.status(200).json({
                found: true,
                name: p.title || '',
                brand: p.brand || p.manufacturer || '',
                description: p.description || '',
            });
        }

        return res.status(200).json({ found: false });

    } catch (e) {
        return res.status(200).json({ found: false });
    }
}
