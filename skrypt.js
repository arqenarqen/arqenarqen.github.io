const produkty = [
    { id: 1, nazwa: "TOREBKA 1", cena: 499, imgs: ["torebka (1).jpg", "torebka (2).jpg"], opis: "Klasyczna elegancja w każdym calu. Idealna na wieczorne wyjścia." },
    { id: 2, nazwa: "TOREBKA 2", cena: 599, imgs: ["torebka (3).jpg", "torebka (4).jpg"], opis: "Pojemna i stylowa. Wykonana z najwyższej jakości materiałów." },
    { id: 3, nazwa: "TOREBKA 3", cena: 299, imgs: ["torebka (5).jpg", "torebka (6).jpg"], opis: "Lekka, miejska torebka na co dzień. Pasuje do jeansów i sukienek." },
    { id: 4, nazwa: "TOREBKA 4", cena: 349, imgs: ["torebka (7).jpg", "torebka (8).jpg"], opis: "Nowoczesny design z nutą retro. Unikalny dodatek do Twojej szafy." },
    { id: 5, nazwa: "TOREBKA 5", cena: 399, imgs: ["torebka (9).jpg", "torebka (10).jpg"], opis: "Minimalizm w czystej postaci. Dyskretne logo i solidne zamki." },
    { id: 6, nazwa: "TOREBKA 6", cena: 450, imgs: ["torebka (11).jpg", "torebka (12).jpg"], opis: "Odważny krój dla pewnych siebie kobiet. Wyróżnij się z tłumu." }
];

document.addEventListener("DOMContentLoaded", () => {
    aktualizujLicznikMenu();
});

function aktualizujLicznikMenu() {
    const koszyk = JSON.parse(localStorage.getItem('koszyk')) || [];
    const sumaIlosci = koszyk.reduce((sum, item) => sum + item.ilosc, 0);
    const liczniki = document.querySelectorAll('.licznik-badge');
    liczniki.forEach(el => {
        el.innerText = sumaIlosci;
        el.style.display = sumaIlosci > 0 ? 'flex' : 'none';
    });
}

function zaladujProdukt() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const produkt = produkty.find(p => p.id === id);

    if (produkt) {
        const mainImg = document.getElementById('img-glowny');
        mainImg.src = produkt.imgs[0];
        document.getElementById('nazwa').innerText = produkt.nazwa;
        document.getElementById('cena').innerText = produkt.cena + " PLN";
        document.getElementById('opis').innerText = produkt.opis;

        const thumbsContainer = document.getElementById('miniatury');
        thumbsContainer.innerHTML = '';
        produkt.imgs.forEach(src => {
            let img = document.createElement('img');
            img.src = src;
            img.onclick = () => { mainImg.src = src; };
            thumbsContainer.appendChild(img);
        });

        const btn = document.getElementById('btn-dodaj');
        btn.onclick = () => {
            dodajDoKoszyka(id);
            const staryTekst = btn.innerText;
            btn.innerText = "DODANO DO KOSZYKA";
            btn.style.background = "#4CAF50";
            setTimeout(() => {
                btn.innerText = staryTekst;
                btn.style.background = "#000";
            }, 1500);
        };
    }
}

function dodajDoKoszyka(id) {
    let koszyk = JSON.parse(localStorage.getItem('koszyk')) || [];
    let item = koszyk.find(i => i.id === id);
    let prod = produkty.find(p => p.id === id);

    if (item) {
        item.ilosc++;
    } else {
        koszyk.push({ id: prod.id, nazwa: prod.nazwa, cena: prod.cena, img: prod.imgs[0], ilosc: 1 });
    }
    
    localStorage.setItem('koszyk', JSON.stringify(koszyk));
    aktualizujLicznikMenu();
}

function zaladujKoszyk() {
    let koszyk = JSON.parse(localStorage.getItem('koszyk')) || [];
    const tbody = document.getElementById('koszyk-lista');
    const sumaElem = document.getElementById('suma');
    const nawigacjaKoszyk = document.getElementById('nav-buttons');
    
    tbody.innerHTML = "";
    let suma = 0;

    if (koszyk.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='padding: 40px; text-align: center;'>Twój koszyk jest pusty.</td></tr>";
        if(nawigacjaKoszyk) nawigacjaKoszyk.style.display = 'none';
        if(sumaElem) sumaElem.innerText = "0 PLN";
    } else {
        if(nawigacjaKoszyk) nawigacjaKoszyk.style.display = 'flex';
        koszyk.forEach((item, index) => {
            let wartosc = item.cena * item.ilosc;
            suma += wartosc;
            
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="width: 80px;"><img src="${item.img}" style="width: 100%; display:block;"></td>
                <td style="text-align: left; font-weight: bold;">${item.nazwa}</td>
                <td>
                    <div class="stepper">
                        <button onclick="zmienIlosc(${index}, -1)">-</button>
                        <span>${item.ilosc}</span>
                        <button onclick="zmienIlosc(${index}, 1)">+</button>
                    </div>
                </td>
                <td>${wartosc} PLN</td>
                <td><button onclick="usun(${index})" class="btn-usun">&times;</button></td>
            `;
            tbody.appendChild(tr);
        });
        if(sumaElem) sumaElem.innerText = suma + " PLN";
    }
}

function zmienIlosc(index, delta) {
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    koszyk[index].ilosc += delta;
    if (koszyk[index].ilosc < 1) koszyk[index].ilosc = 1;
    localStorage.setItem('koszyk', JSON.stringify(koszyk));
    zaladujKoszyk();
    aktualizujLicznikMenu();
}

function usun(index) {
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    koszyk.splice(index, 1);
    localStorage.setItem('koszyk', JSON.stringify(koszyk));
    zaladujKoszyk();
    aktualizujLicznikMenu();
}

function zaladujPodsumowanie() {
    let koszyk = JSON.parse(localStorage.getItem('koszyk')) || [];
    const lista = document.getElementById('lista-skrocona');
    const total = document.getElementById('total-do-zaplaty');
    
    if(koszyk.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    let suma = 0;
    lista.innerHTML = '';
    
    koszyk.forEach(item => {
        suma += item.cena * item.ilosc;
        let li = document.createElement('li');
        li.innerHTML = `<span>${item.nazwa} <small>x${item.ilosc}</small></span> <span>${item.cena * item.ilosc} PLN</span>`;
        lista.appendChild(li);
    });

    total.innerText = suma + " PLN";
}

function zlozZamowienie(event) {
    event.preventDefault();
    const imie = document.querySelector('input[name="imie"]').value;
    
    document.querySelector('.layout-checkout').innerHTML = `
        <div style="text-align: center; width: 100%; padding: 80px 20px;">
            <h1 style="color: #2e7d32; font-size: 40px; margin-bottom: 20px;">Dziękujemy, ${imie}!</h1>
            <p style="font-size: 18px; margin-bottom: 30px;">Twoje zamówienie zostało przyjęte do realizacji.</p>
            <a href="index.html" class="btn-sklep">WRÓĆ NA STRONĘ GŁÓWNĄ</a>
        </div>
    `;
    
    localStorage.removeItem('koszyk');
    aktualizujLicznikMenu();
}