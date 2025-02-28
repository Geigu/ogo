async function checkAccount() {
    const username = document.getElementById('username').value;
    const result = document.getElementById('result');

    try {
        
        const response = await fetch(`https://api.namemc.com/profile/${username}`);
        const data = await response.json();

        if (data) {
            const capeUrls = [
                "https://namemc.com/cape/1981aad373fa9754",
                "https://namemc.com/cape/72ee2cfcefbfc081",
                "https://namemc.com/cape/0e4cc75a5f8a886d",
                "https://namemc.com/cape/ebc798c3f7eca2a3",
                "https://namemc.com/cape/9349fa25c64ae935"
            ];

            let capeYear = "";
            let offerPrice = 0;

            
            for (const capeUrl of capeUrls) {
                if (data.capes.includes(capeUrl)) {
                    capeYear = capeUrl.split('/').pop().slice(0, 4);
                    offerPrice = calculatePrice(capeYear, data.nameChanges);
                    break;
                }
            }

            if (capeYear) {
                result.innerHTML = `
                    <p>Hey!</p>
                    <p>I hope you are doing well,</p>
                    <p>I noticed you have a Minecon ${capeYear} cape on your Minecraft account. I collect capes so I was just wondering if you'd consider selling yours?</p>
                    <p>I'd like to make you an offer of $${offerPrice} for it. Let me know if you're interested :)</p>
                    <p>Best wishes,<br>Geigi</p>
                    <button class="copy-button" onclick="copyGeneratedText(this)">Copy Generated Text</button>
                `;
            } else {
                result.textContent = `Username ${username} found, but no capes detected.`;
            }
        } else {
            result.textContent = `Username ${username} not found.`;
        }
    } catch (error) {
        result.textContent = 'Error checking username.';
        console.error('Error:', error);
    }
}

function calculatePrice(capeYear, nameChanges) {
    
    const basePrice = 100;
    const yearFactor = (new Date().getFullYear() - parseInt(capeYear)) * 10;
    const nameChangeFactor = nameChanges * 5;

    return basePrice + yearFactor - nameChangeFactor;
}

function generateInfo() {
    const username = document.getElementById('username').value;
    const capeYear = document.getElementById('cape-year').value;
    const nameChanges = parseInt(document.getElementById('name-changes').value);
    const textType = document.getElementById('text-type').value;
    const senderName = document.getElementById('sender-name').value;
    const result = document.getElementById('result');

    if (!capeYear || isNaN(nameChanges)) {
        result.textContent = 'Please fill in all fields except username.';
        return;
    }

    const offerPrice = getPriceForYearAndChanges(capeYear, nameChanges);

    let text = '';
    if (textType === 'Discord') {
        text = `
            Hey! Sorry for bothering you, I don't think we have met before
            I noticed you have a Minecon ${capeYear} cape on your Minecraft account (if your account has the name ${username || ''}). I collect capes so I was just wondering if you'd consider selling yours?
            I'd like to make you an offer of $${offerPrice} for it. Let me know if you're interested 🙂
        `;
    }

    if (textType === 'Email') {
        text = `
            <p>Hey ${username || ''}!
            I hope you are doing well,I noticed you have a Minecon ${capeYear} cape on your Minecraft account  (if your account has the name ${username || ''}). I collect capes so I was just wondering if you'd consider selling yours?
            I'd like to make you an offer of $${offerPrice} for it. Let me know if you're interested :)
            Best wishes,<br>${senderName || ''}</p>
        `;
    }

    result.innerHTML = `<div class="result-box"><p>${text.replace(/\n/g, '<br>')}</p><button class="copy-button" onclick="copyGeneratedText(this)">Copy Generated Text</button></div>`;
}

function getPriceForYearAndChanges(year, changes) {
    const prices = {
        "2011": [2500, 1500, 1400, 1200, 1200, 1200, 1200, 1100, 1100, 1100, 1100, 1000],
        "2012": [2000, 1500, 1300, 1100, 1100, 1100, 1100, 1000, 1000, 1000, 1000, 800],
        "2013": [900, 700, 650, 550, 550, 550, 550, 450, 450, 450, 450, 400],
        "2015": [700, 650, 600, 500, 500, 500, 500, 450, 450, 450, 450, 350],
        "2016": [1200, 900, 800, 700, 700, 700, 700, 600, 600, 600, 600, 500]
    };

    if (changes >= 11) {
        changes = 11;
    }

    return prices[year][changes];
}

function copyText(button) {
    const textElement = button.previousElementSibling;
    const text = textElement.innerText || textElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
        button.classList.add('copied');
        setTimeout(() => button.classList.remove('copied'), 2000);
    });
}

function copyGeneratedText(button) {
    const resultBox = document.querySelector('.result-box p');
    const text = resultBox.innerText || resultBox.textContent;
    navigator.clipboard.writeText(text).then(() => {
        button.style.backgroundColor = 'black';
        button.textContent = 'Copied';
        setTimeout(() => {
            button.style.backgroundColor = '';
            button.textContent = 'Copy Generated Text';
        }, 2000);
    });
}