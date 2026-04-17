// --- Configuration ---
const COOLDOWN_MS = 2000; // Same EAN won't count again within 2 seconds

// --- State ---
let scanner = null;
const scannedItems = new Map(); // EAN -> quantity
const productInfo = new Map();  // EAN -> { name, brand, description } or null
const lastScanTime = new Map(); // EAN -> timestamp (debounce)

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    startScanner();
    renderItems();
});

// --- Scanner ---
function startScanner() {
    scanner = new Html5Qrcode('scanner');

    const config = {
        fps: 30,
        // No qrbox — use the full camera frame for scanning
        formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
        ],
        experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
        },
    };

    scanner.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        () => {}
    ).catch(() => {
        showStatus('Camera access denied. Please allow camera access and reload.', 'error');
    });
}

function onScanSuccess(decodedText) {
    const now = Date.now();
    const lastTime = lastScanTime.get(decodedText) || 0;
    if (now - lastTime < COOLDOWN_MS) return;

    lastScanTime.set(decodedText, now);

    const currentQty = scannedItems.get(decodedText) || 0;
    scannedItems.set(decodedText, currentQty + 1);

    if (!productInfo.has(decodedText)) {
        lookupEan(decodedText);
    }

    playBeep();
    vibrate();
    showScanFeedback();
    renderItems();
}

// --- EAN Lookup (via Vercel proxy) ---
async function lookupEan(ean) {
    try {
        const res = await fetch(`/api/lookup?ean=${ean}`);
        if (res.ok) {
            const data = await res.json();
            productInfo.set(ean, data.found ? data : null);
            renderItems();
            return;
        }
    } catch (e) {}
    productInfo.set(ean, null);
    renderItems();
}

// --- Feedback ---
function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 1200;
        osc.type = 'sine';
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
}

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(80);
}

function showScanFeedback() {
    const flash = document.getElementById('flash');
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 250);
}

// --- Render ---
function renderItems() {
    const list = document.getElementById('items-list');
    const totalCount = document.getElementById('total-count');
    const sendBtn = document.getElementById('send-btn');

    let totalProducts = 0;
    let totalItems = 0;
    let html = '';

    const entries = Array.from(scannedItems.entries()).reverse();

    for (const [ean, qty] of entries) {
        totalProducts++;
        totalItems += qty;

        const info = productInfo.get(ean);
        const nameHtml = info && info.name
            ? `<div class="item-name">${info.name}</div>`
            : !productInfo.has(ean)
                ? `<div class="item-name loading">Søger...</div>`
                : '';

        html += `
            <div class="item">
                <div class="item-details">
                    <div class="item-ean">${ean}</div>
                    ${nameHtml}
                </div>
                <div class="item-qty">${qty}x</div>
                <button class="item-remove" onclick="removeItem('${ean}')" aria-label="Remove">✕</button>
            </div>
        `;
    }

    list.innerHTML = html || '<div class="empty">Scan EAN codes to begin...</div>';
    totalCount.textContent = totalProducts > 0
        ? `${totalProducts} produkt${totalProducts !== 1 ? 'er' : ''}, ${totalItems} stk. i alt`
        : 'Ingen varer scannet';
    sendBtn.disabled = totalProducts === 0;
}

function removeItem(ean) {
    scannedItems.delete(ean);
    productInfo.delete(ean);
    lastScanTime.delete(ean);
    renderItems();
}

function clearAll() {
    if (scannedItems.size === 0) return;
    if (!confirm('Ryd alle scannede varer?')) return;
    scannedItems.clear();
    productInfo.clear();
    lastScanTime.clear();
    renderItems();
}

// --- Google Sheets ---
async function sendToSheets() {
    const url = localStorage.getItem('googleScriptUrl');
    if (!url) {
        openSettings();
        showStatus('Tilføj din Google Apps Script URL først.', 'error');
        return;
    }

    const items = [];
    scannedItems.forEach((qty, ean) => {
        const info = productInfo.get(ean);
        items.push({
            ean,
            quantity: qty,
            info: (info && info.found) ? info : null,
        });
    });

    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;
    const originalText = sendBtn.textContent;
    sendBtn.textContent = 'Sender...';

    try {
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                items,
                category: document.getElementById('category-select').value,
            }),
        });

        showStatus('Sendt til Google Sheets!', 'success');
        scannedItems.clear();
        productInfo.clear();
        lastScanTime.clear();
        renderItems();
    } catch (error) {
        showStatus('Fejl ved afsendelse. Tjek din forbindelse.', 'error');
    }

    sendBtn.disabled = false;
    sendBtn.textContent = originalText;
}

// --- Manual entry ---
function addManualEan() {
    const input = document.getElementById('manual-ean');
    const ean = input.value.trim();

    if (!ean || ean.length < 8 || ean.length > 13 || !/^\d+$/.test(ean)) {
        showStatus('Indtast en gyldig EAN (8-13 cifre)', 'error');
        return;
    }

    const currentQty = scannedItems.get(ean) || 0;
    scannedItems.set(ean, currentQty + 1);

    if (!productInfo.has(ean)) {
        lookupEan(ean);
    }

    input.value = '';
    playBeep();
    renderItems();
}

// --- Status messages ---
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 3000);
}

// --- Settings ---
function openSettings() {
    document.getElementById('settings-modal').style.display = 'flex';
    document.getElementById('script-url-input').value =
        localStorage.getItem('googleScriptUrl') || '';
}

function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
}

function saveSettings() {
    const url = document.getElementById('script-url-input').value.trim();
    if (url && !url.includes('script.google.com/')) {
        showStatus('URL skal være en Google Apps Script URL', 'error');
        return;
    }
    localStorage.setItem('googleScriptUrl', url);
    closeSettings();
    showStatus('Indstillinger gemt!', 'success');
}
