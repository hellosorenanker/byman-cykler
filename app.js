// --- Configuration ---
const COOLDOWN_MS = 2000; // Same EAN won't count again within 2 seconds

// --- State ---
let scanner = null;
const scannedItems = new Map(); // EAN -> quantity
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
        fps: 15,
        qrbox: { width: 280, height: 120 },
        formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
        ],
    };

    scanner.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        () => {} // Ignore frames without barcodes
    ).catch(err => {
        showStatus('Camera access denied. Please allow camera access and reload.', 'error');
    });
}

function onScanSuccess(decodedText) {
    const now = Date.now();
    const lastTime = lastScanTime.get(decodedText) || 0;

    // Debounce: skip if same EAN scanned within cooldown period
    if (now - lastTime < COOLDOWN_MS) return;

    lastScanTime.set(decodedText, now);

    // Increment quantity
    const currentQty = scannedItems.get(decodedText) || 0;
    scannedItems.set(decodedText, currentQty + 1);

    playBeep();
    vibrate();
    showScanFeedback();
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
    } catch (e) {
        // Audio not supported, skip silently
    }
}

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(80);
    }
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

    // Show newest items first
    const entries = Array.from(scannedItems.entries()).reverse();

    for (const [ean, qty] of entries) {
        totalProducts++;
        totalItems += qty;
        html += `
            <div class="item">
                <div class="item-ean">${ean}</div>
                <div class="item-qty">${qty}x</div>
                <button class="item-remove" onclick="removeItem('${ean}')" aria-label="Remove">✕</button>
            </div>
        `;
    }

    list.innerHTML = html || '<div class="empty">Scan EAN codes to begin...</div>';
    totalCount.textContent = totalProducts > 0
        ? `${totalProducts} product${totalProducts !== 1 ? 's' : ''}, ${totalItems} item${totalItems !== 1 ? 's' : ''} total`
        : 'No items scanned';
    sendBtn.disabled = totalProducts === 0;
}

function removeItem(ean) {
    scannedItems.delete(ean);
    lastScanTime.delete(ean);
    renderItems();
}

function clearAll() {
    if (scannedItems.size === 0) return;
    if (!confirm('Clear all scanned items?')) return;
    scannedItems.clear();
    lastScanTime.clear();
    renderItems();
}

// --- Google Sheets ---
async function sendToSheets() {
    const url = localStorage.getItem('googleScriptUrl');
    if (!url) {
        openSettings();
        showStatus('Please add your Google Apps Script URL first.', 'error');
        return;
    }

    const items = [];
    scannedItems.forEach((qty, ean) => {
        items.push({ ean, quantity: qty });
    });

    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;
    const originalText = sendBtn.textContent;
    sendBtn.textContent = 'Sending...';

    try {
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ items }),
        });

        // no-cors means we can't read the response, but if no error, data was sent
        showStatus('Sent to Google Sheets!', 'success');
        scannedItems.clear();
        lastScanTime.clear();
        renderItems();
    } catch (error) {
        showStatus('Failed to send. Check your connection and try again.', 'error');
    }

    sendBtn.disabled = false;
    sendBtn.textContent = originalText;
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
    if (url && !url.startsWith('https://script.google.com/')) {
        showStatus('URL should start with https://script.google.com/', 'error');
        return;
    }
    localStorage.setItem('googleScriptUrl', url);
    closeSettings();
    showStatus('Settings saved!', 'success');
}
